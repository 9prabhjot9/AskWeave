// QA Contract
// This is a JavaScript version of the TypeScript contract

// Initial state
export const initialState = {
  questions: [],
  answers: [],
  users: {},
  owner: "",
  version: "1.0.0",
};

// Contract handlers
export function handle(state, action) {
  const input = action.input;
  const caller = action.caller;

  if (input.function === "addQuestion") {
    return addQuestion(state, caller, input.title, input.content);
  }

  if (input.function === "addAnswer") {
    return addAnswer(state, caller, input.questionId, input.content);
  }

  if (input.function === "upvoteAnswer") {
    return upvoteAnswer(state, caller, input.answerId);
  }

  if (input.function === "getQuestions") {
    return { result: state.questions };
  }

  if (input.function === "getAnswers") {
    return { result: getAnswers(state, input.questionId) };
  }

  throw new ContractError(`Unknown function: ${input.function}`);
}

// Add a new question
function addQuestion(state, caller, title, content) {
  if (!title || !content) {
    throw new ContractError("Title and content are required");
  }

  const questionId = generateId();
  const timestamp = Date.now();

  const question = {
    id: questionId,
    title,
    content,
    author: caller,
    timestamp,
    upvotes: 0,
  };

  state.questions.push(question);
  return { state };
}

// Add a new answer
function addAnswer(state, caller, questionId, content) {
  if (!questionId || !content) {
    throw new ContractError("Question ID and content are required");
  }

  const questionExists = state.questions.some((q) => q.id === questionId);
  if (!questionExists) {
    throw new ContractError("Question not found");
  }

  const answerId = generateId();
  const timestamp = Date.now();

  const answer = {
    id: answerId,
    questionId,
    content,
    author: caller,
    timestamp,
    upvotes: 0,
  };

  state.answers.push(answer);
  return { state };
}

// Upvote an answer
function upvoteAnswer(state, caller, answerId) {
  if (!answerId) {
    throw new ContractError("Answer ID is required");
  }

  const answerIndex = state.answers.findIndex((a) => a.id === answerId);
  if (answerIndex === -1) {
    throw new ContractError("Answer not found");
  }

  state.answers[answerIndex].upvotes += 1;
  return { state };
}

// Get answers for a question
function getAnswers(state, questionId) {
  if (!questionId) {
    throw new ContractError("Question ID is required");
  }

  return state.answers.filter((a) => a.questionId === questionId);
}

// Helper function to generate a unique ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
} 