// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract AdaptiveLearning {
    // Events
    event StudentRegistered(address indexed student);
    event CourseAdded(uint256 courseId, string name, uint256 reward);
    event ProgressUpdated(
        address indexed student,
        uint256 courseId,
        uint256 milestone,
        uint256 timestamp
    );
    event RewardClaimed(address indexed student, uint256 courseId, uint256 amount);

    // Structs
    struct Course {
        string name;
        string descriptionURI; // URI to course details (e.g., IPFS link)
        uint256 totalMilestones;
        uint256 rewardPerMilestone;
        bool exists;
    }

    struct Progress {
        uint256 completedMilestones;
        uint256 lastUpdated;
    }

    // State Variables
    address public owner;
    mapping(address => bool) public registeredStudents;
    mapping(uint256 => Course) public courses;
    mapping(address => mapping(uint256 => Progress)) public studentProgress; // student => courseId => Progress
    uint256 public courseCounter;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this.");
        _;
    }

    modifier onlyRegisteredStudent() {
        require(registeredStudents[msg.sender], "You must be a registered student.");
        _;
    }

    modifier validCourse(uint256 courseId) {
        require(courses[courseId].exists, "Course does not exist.");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // Functions

    /// @notice Register a student
    function registerStudent() external {
        require(!registeredStudents[msg.sender], "Already registered.");
        registeredStudents[msg.sender] = true;
        emit StudentRegistered(msg.sender);
    }

    /// @notice Add a new course
    /// @dev Only owner can add courses
    function addCourse(
        string memory _name,
        string memory _descriptionURI,
        uint256 _totalMilestones,
        uint256 _rewardPerMilestone
    ) external onlyOwner {
        courseCounter++;

        courses[courseCounter] = Course({
            name: _name,
            descriptionURI: _descriptionURI,
            totalMilestones: _totalMilestones,
            rewardPerMilestone: _rewardPerMilestone,
            exists: true
        });

        emit CourseAdded(courseCounter, _name, _rewardPerMilestone);
    }

    /// @notice Update progress for a student in a course
    /// @param _courseId The ID of the course
    /// @param _milestonesCompleted The number of milestones completed
    function updateProgress(uint256 _courseId, uint256 _milestonesCompleted)
        external
        onlyRegisteredStudent
        validCourse(_courseId)
    {
        Course storage course = courses[_courseId];
        Progress storage progress = studentProgress[msg.sender][_courseId];

        require(
            _milestonesCompleted > progress.completedMilestones,
            "New milestones must exceed previous progress."
        );
        require(
            _milestonesCompleted <= course.totalMilestones,
            "Cannot exceed total milestones."
        );

        progress.completedMilestones = _milestonesCompleted;
        progress.lastUpdated = block.timestamp;

        emit ProgressUpdated(
            msg.sender,
            _courseId,
            _milestonesCompleted,
            block.timestamp
        );
    }

    /// @notice Claim rewards for completed milestones
    /// @param _courseId The ID of the course
    function claimReward(uint256 _courseId)
        external
        onlyRegisteredStudent
        validCourse(_courseId)
    {
        Progress storage progress = studentProgress[msg.sender][_courseId];
        Course storage course = courses[_courseId];

        uint256 totalReward = progress.completedMilestones *
            course.rewardPerMilestone;

        require(totalReward > 0, "No rewards available.");
        require(address(this).balance >= totalReward, "Insufficient contract balance.");

        // Reset progress rewards to avoid double-claiming
        progress.completedMilestones = 0;

        payable(msg.sender).transfer(totalReward);

        emit RewardClaimed(msg.sender, _courseId, totalReward);
    }

    /// @notice Fund the contract for rewards
    function fundContract() external payable onlyOwner {
        require(msg.value > 0, "Must send funds.");
    }

    /// @notice Withdraw funds by the owner
    function withdrawFunds(uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient balance.");
        payable(owner).transfer(_amount);
    }

    /// @notice Get course details
    function getCourseDetails(uint256 _courseId)
        external
        view
        validCourse(_courseId)
        returns (Course memory)
    {
        return courses[_courseId];
    }

    /// @notice Get student progress in a course
    function getStudentProgress(address _student, uint256 _courseId)
        external
        view
        validCourse(_courseId)
        returns (Progress memory)
    {
        return studentProgress[_student][_courseId];
    }
}
