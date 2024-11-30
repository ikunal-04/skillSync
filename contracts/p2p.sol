// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract PeerToPeerMentorship {
    // Events
    event MentorRegistered(
        address indexed mentor,
        string expertise,
        uint256 hourlyRate
    );
    event SessionBooked(
        address indexed mentee,
        address indexed mentor,
        uint256 sessionId,
        uint256 timestamp,
        uint256 duration
    );
    event SessionCompleted(uint256 indexed sessionId, uint256 timestamp);
    event PaymentReleased(address indexed mentor, uint256 amount);
    event MentorWithdrawn(address indexed mentor, uint256 amount);

    // Structs
    struct Mentor {
        string expertise;
        uint256 hourlyRate; // in wei
        bool isAvailable;
        uint256 balance; // mentor's earnings held in the contract
    }

    struct Session {
        address mentor;
        address mentee;
        uint256 startTime;
        uint256 duration; // in hours
        uint256 payment; // total payment for the session
        bool isCompleted;
    }

    // State Variables
    address public owner;
    uint256 public sessionCounter;
    mapping(address => Mentor) public mentors;
    mapping(uint256 => Session) public sessions;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this.");
        _;
    }

    modifier onlyAvailableMentor(address _mentor) {
        require(
            mentors[_mentor].isAvailable,
            "The mentor is not available."
        );
        _;
    }

    modifier onlyValidSession(uint256 _sessionId) {
        require(
            _sessionId <= sessionCounter,
            "Invalid session ID."
        );
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // Functions

    /// @notice Register a mentor with their expertise and hourly rate
    /// @param _expertise The mentor's area of expertise
    /// @param _hourlyRate The mentor's hourly rate in wei
    function registerMentor(string memory _expertise, uint256 _hourlyRate) external {
        require(bytes(_expertise).length > 0, "Expertise is required.");
        require(_hourlyRate > 0, "Hourly rate must be greater than 0.");
        require(
            bytes(mentors[msg.sender].expertise).length == 0,
            "Mentor already registered."
        );

        mentors[msg.sender] = Mentor({
            expertise: _expertise,
            hourlyRate: _hourlyRate,
            isAvailable: true,
            balance: 0
        });

        emit MentorRegistered(msg.sender, _expertise, _hourlyRate);
    }

    /// @notice Book a mentorship session
    /// @param _mentor The address of the mentor
    /// @param _duration The duration of the session in hours
    function bookSession(address _mentor, uint256 _duration)
        external
        payable
        onlyAvailableMentor(_mentor)
    {
        require(_duration > 0, "Session duration must be greater than 0.");
        Mentor storage mentor = mentors[_mentor];
        uint256 totalCost = mentor.hourlyRate * _duration;

        require(msg.value == totalCost, "Incorrect payment amount.");
        require(msg.sender != _mentor, "Mentors cannot book themselves.");

        sessionCounter++;
        sessions[sessionCounter] = Session({
            mentor: _mentor,
            mentee: msg.sender,
            startTime: block.timestamp,
            duration: _duration,
            payment: totalCost,
            isCompleted: false
        });

        emit SessionBooked(msg.sender, _mentor, sessionCounter, block.timestamp, _duration);
    }

    /// @notice Mark a session as completed
    /// @param _sessionId The ID of the session
    function completeSession(uint256 _sessionId) external onlyValidSession(_sessionId) {
        Session storage session = sessions[_sessionId];
        require(msg.sender == session.mentor, "Only mentor can mark as completed.");
        require(!session.isCompleted, "Session already completed.");

        session.isCompleted = true;

        // Transfer funds to mentor
        mentors[session.mentor].balance += session.payment;

        emit SessionCompleted(_sessionId, block.timestamp);
        emit PaymentReleased(session.mentor, session.payment);
    }

    /// @notice Withdraw earnings as a mentor
    function withdrawEarnings() external {
        Mentor storage mentor = mentors[msg.sender];
        uint256 amount = mentor.balance;

        require(amount > 0, "No earnings available.");
        mentor.balance = 0;

        payable(msg.sender).transfer(amount);

        emit MentorWithdrawn(msg.sender, amount);
    }

    /// @notice Update mentor availability
    /// @param _isAvailable The mentor's availability status
    function updateAvailability(bool _isAvailable) external {
        Mentor storage mentor = mentors[msg.sender];
        require(bytes(mentor.expertise).length > 0, "You are not a registered mentor.");

        mentor.isAvailable = _isAvailable;
    }

    /// @notice Get mentor details
    /// @param _mentor The address of the mentor
    function getMentorDetails(address _mentor) external view returns (Mentor memory) {
        return mentors[_mentor];
    }

    /// @notice Get session details
    /// @param _sessionId The ID of the session
    function getSessionDetails(uint256 _sessionId)
        external
        view
        onlyValidSession(_sessionId)
        returns (Session memory)
    {
        return sessions[_sessionId];
    }
}
