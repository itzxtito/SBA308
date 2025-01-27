// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    },
    {
      learner_id: 132,
      assignment_id: 3,
      submission: {
        submitted_at: "2025-01-01",
        score: 200
      }
    }
  ];
  
  function getLearnerData(course, ag, submissions) {
    try {
      // Step 1: Validate Input Data
      if (ag.course_id !== course.id) {
        throw new Error("Assignment Group course_id does not match CourseInfo id");
      }
  
      ag.assignments.forEach(assignment => {
        if (assignment.points_possible === 0) {
          throw new Error(`Assignment ${assignment.name} has zero points_possible`);
        }
      });
  
      // Step 2: Filter valid assignments (due date in the past)
      const currentDate = new Date();
      const validAssignments = ag.assignments.filter(assignment => {
        const dueDate = new Date(assignment.due_at);
        return dueDate <= currentDate; // Only assignments whose due date has passed
      });
  
      // Step 3: Remove invalid submissions
      const validSubmissions = submissions.filter(submission => {
        const assignment = validAssignments.find(a => a.id === submission.assignment_id);
        return assignment !== undefined; // Keep only submissions for valid assignments
      });
  
      // Step 4: Process submissions for each learner
      const result = [];
      const learnerIds = [...new Set(validSubmissions.map(sub => sub.learner_id))]; // Get unique learner IDs
  
      learnerIds.forEach(learnerId => {
        const learnerData = { id: learnerId };
        let totalWeightedScore = 0;
        let totalPoints = 0;
  
        validAssignments.forEach(assignment => {
          const submission = validSubmissions.find(
            sub => sub.learner_id === learnerId && sub.assignment_id === assignment.id
          );
  
          if (!submission) {
            // Skip assignments with no submissions
            return; 
          }
  
          let adjustedScore = submission.submission.score;
          const dueDate = new Date(assignment.due_at);
  
          // Step 5: Calculate Scores and Penalties for late submissions using switch
          switch (true) {
            case new Date(submission.submission.submitted_at) > dueDate:
              adjustedScore -= assignment.points_possible * 0.10; // Deduct 10% of points_possible
              break;
            default:
              break; // No penalty if submitted on time
          }
  
          // Ensure score doesn't go below 0
          adjustedScore = Math.max(adjustedScore, 0);
  
          // Calculate percentage for this assignment
          const percentage = (adjustedScore / assignment.points_possible) * 100;
  
          // Store the result for this assignment
          learnerData[assignment.id] = {
            score: adjustedScore, // Adjusted score after penalty
            percentage: Number(percentage.toFixed(2))
          };
  
          // Step 6: Calculate Weighted Scores based on group_weight
          const weightedScore = adjustedScore * (ag.group_weight / 100);
          totalWeightedScore += weightedScore;
          totalPoints += assignment.points_possible * (ag.group_weight / 100);
        });
  
        // Step 7: Calculate Weighted Average for the learner
        learnerData.avg =
          totalPoints > 0 ? Number(((totalWeightedScore / totalPoints) * 100).toFixed(2)) : 0;
  
        result.push(learnerData);
      });
  
      // Step 8: Format the output
      return result;
    } catch (error) {
      console.error("An error occurred while processing learner data:", error);
      return [];
    }
  }
  
  // Example usage with JavaScript Course
  console.log("JavaScript Course Results:");
  console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions));
  