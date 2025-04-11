/**
 * Q&A Platform SmartWeave Contract
 * This contract handles Q&A functionalities like questions, answers, voting, and bounties
 */

// Contract state interface
export interface State {
  owner: string;
  name: string;
  description: string;
  questions: Record<string, Question>;
  answers: Record<string, Answer>;
  votes: Record<string, Vote>;
  users: Record<string, User>;
  bounties: Record<string, Bounty>;
  tags: string[];
  daoProposals: Record<string, DaoProposal>;
  daoSettings: DaoSettings;
  version: string;
}

// Question interface
export interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: number;
  tags: string[];
  answerIds: string[];
  voteCount: number;
  bountyAmount: number;
  bountyId?: string;
  isClosed: boolean;
  isAccepted: boolean;
  acceptedAnswerId?: string;
  viewCount: number;
  commentIds: string[];
}

// Answer interface
export interface Answer {
  id: string;
  questionId: string;
  content: string;
  author: string;
  timestamp: number;
  voteCount: number;
  isAccepted: boolean;
  commentIds: string[];
}

// Comment interface
export interface Comment {
  id: string;
  parentId: string; // Either question ID or answer ID
  parentType: 'question' | 'answer';
  content: string;
  author: string;
  timestamp: number;
}

// Vote interface
export interface Vote {
  id: string;
  targetId: string;
  targetType: 'question' | 'answer' | 'comment';
  voter: string;
  voteType: 'up' | 'down';
  timestamp: number;
}

// User interface
export interface User {
  address: string;
  username?: string;
  reputation: number;
  questionIds: string[];
  answerIds: string[];
  voteIds: string[];
  joinDate: number;
  lastActive: number;
}

// Bounty interface
export interface Bounty {
  id: string;
  questionId: string;
  sponsor: string;
  amount: number;
  timestamp: number;
  isActive: boolean;
  isPaid: boolean;
  paidTo?: string;
  txId?: string;
}

// DAO Proposal interface
export interface DaoProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  timestamp: number;
  voteEndTimestamp: number;
  votesFor: number;
  votesAgainst: number;
  voterAddresses: string[];
  type: 'feature' | 'parameter' | 'bounty' | 'other';
  status: 'open' | 'approved' | 'rejected' | 'implemented';
  implementation?: any;
}

// DAO Settings interface
export interface DaoSettings {
  votingPeriodLength: number; // in milliseconds
  minimumQuorum: number; // minimum number of votes required
  reputationThreshold: number; // minimum reputation required to create proposal
}

// Initial state
export const initialState: State = {
  owner: '', // Will be set at deployment
  name: 'AskWeave',
  description: 'Decentralized Q&A Platform',
  questions: {},
  answers: {},
  votes: {},
  users: {},
  bounties: {},
  tags: [],
  daoProposals: {},
  daoSettings: {
    votingPeriodLength: 7 * 24 * 60 * 60 * 1000, // 7 days
    minimumQuorum: 10,
    reputationThreshold: 100,
  },
  version: '1.0.0',
};

/**
 * Handle contract action
 */
export function handle(state: State, action: any): { state: State } | { result: any } {
  const input = action.input;
  const caller = action.caller;

  // Ensure user exists
  if (!state.users[caller] && input.function !== 'registerUser') {
    state.users[caller] = {
      address: caller,
      reputation: 0,
      questionIds: [],
      answerIds: [],
      voteIds: [],
      joinDate: Date.now(),
      lastActive: Date.now(),
    };
  }

  // Update user's last active time
  if (state.users[caller]) {
    state.users[caller].lastActive = Date.now();
  }

  // Route functions
  switch (input.function) {
    case 'registerUser':
      return registerUser(state, caller, input.username);
    case 'askQuestion':
      return askQuestion(state, caller, input.title, input.content, input.tags);
    case 'answerQuestion':
      return answerQuestion(state, caller, input.questionId, input.content);
    case 'addComment':
      return addComment(state, caller, input.parentId, input.parentType, input.content);
    case 'voteOnContent':
      return voteOnContent(state, caller, input.targetId, input.targetType, input.voteType);
    case 'createBounty':
      return createBounty(state, caller, input.questionId, input.amount);
    case 'awardBounty':
      return awardBounty(state, caller, input.bountyId, input.recipientAddress);
    case 'acceptAnswer':
      return acceptAnswer(state, caller, input.questionId, input.answerId);
    case 'createDaoProposal':
      return createDaoProposal(state, caller, input.title, input.description, input.type, input.implementation);
    case 'voteOnProposal':
      return voteOnProposal(state, caller, input.proposalId, input.voteFor);
    case 'implementProposal':
      return implementProposal(state, caller, input.proposalId);
    case 'getQuestions':
      return getQuestions(state, input.limit, input.offset, input.sort);
    case 'getQuestion':
      return getQuestion(state, input.questionId);
    case 'getUserProfile':
      return getUserProfile(state, input.address);
    case 'updateTags':
      return updateTags(state, caller, input.tags);
    default:
      throw new ContractError(`Function '${input.function}' not found`);
  }
}

/**
 * Register a new user
 */
function registerUser(state: State, caller: string, username?: string): { state: State } {
  if (state.users[caller]) {
    throw new ContractError('User already registered');
  }

  state.users[caller] = {
    address: caller,
    username,
    reputation: 0,
    questionIds: [],
    answerIds: [],
    voteIds: [],
    joinDate: Date.now(),
    lastActive: Date.now(),
  };

  return { state };
}

/**
 * Ask a new question
 */
function askQuestion(
  state: State,
  caller: string,
  title: string,
  content: string,
  tags: string[]
): { state: State; result: { questionId: string } } {
  // Basic validation
  if (!title || !content) {
    throw new ContractError('Title and content are required');
  }
  
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    throw new ContractError('At least one tag is required');
  }

  const questionId = `question-${Date.now()}-${caller.substring(0, 6)}`;
  
  // Create question
  state.questions[questionId] = {
    id: questionId,
    title,
    content,
    author: caller,
    timestamp: Date.now(),
    tags,
    answerIds: [],
    voteCount: 0,
    bountyAmount: 0,
    isClosed: false,
    isAccepted: false,
    viewCount: 0,
    commentIds: [],
  };
  
  // Update user's question list
  state.users[caller].questionIds.push(questionId);
  
  // Award a small amount of reputation for asking a question
  state.users[caller].reputation += 1;
  
  // Update tags
  for (const tag of tags) {
    if (!state.tags.includes(tag)) {
      state.tags.push(tag);
    }
  }
  
  return { state, result: { questionId } };
}

/**
 * Answer a question
 */
function answerQuestion(
  state: State,
  caller: string,
  questionId: string,
  content: string
): { state: State; result: { answerId: string } } {
  // Validate
  if (!content) {
    throw new ContractError('Answer content is required');
  }
  
  const question = state.questions[questionId];
  if (!question) {
    throw new ContractError('Question not found');
  }
  
  if (question.isClosed) {
    throw new ContractError('Cannot answer closed question');
  }
  
  const answerId = `answer-${Date.now()}-${caller.substring(0, 6)}`;
  
  // Create answer
  state.answers[answerId] = {
    id: answerId,
    questionId,
    content,
    author: caller,
    timestamp: Date.now(),
    voteCount: 0,
    isAccepted: false,
    commentIds: [],
  };
  
  // Update question's answers
  question.answerIds.push(answerId);
  
  // Update user's answers
  state.users[caller].answerIds.push(answerId);
  
  // Award a small amount of reputation for answering
  state.users[caller].reputation += 2;
  
  return { state, result: { answerId } };
}

/**
 * Add a comment to a question or answer
 */
function addComment(
  state: State,
  caller: string,
  parentId: string,
  parentType: 'question' | 'answer',
  content: string
): { state: State; result: { commentId: string } } {
  // Validate
  if (!content) {
    throw new ContractError('Comment content is required');
  }
  
  let parent;
  if (parentType === 'question') {
    parent = state.questions[parentId];
  } else if (parentType === 'answer') {
    parent = state.answers[parentId];
  }
  
  if (!parent) {
    throw new ContractError(`${parentType} not found`);
  }
  
  const commentId = `comment-${Date.now()}-${caller.substring(0, 6)}`;
  
  // Create comment
  if (!parent.commentIds) {
    parent.commentIds = [];
  }
  
  parent.commentIds.push(commentId);
  
  return { state, result: { commentId } };
}

/**
 * Vote on a question, answer, or comment
 */
function voteOnContent(
  state: State,
  caller: string,
  targetId: string,
  targetType: 'question' | 'answer' | 'comment',
  voteType: 'up' | 'down'
): { state: State; result: { voteId: string } } {
  // Validate
  let target;
  if (targetType === 'question') {
    target = state.questions[targetId];
  } else if (targetType === 'answer') {
    target = state.answers[targetId];
  } else {
    throw new ContractError('Invalid target type');
  }
  
  if (!target) {
    throw new ContractError(`${targetType} not found`);
  }
  
  // Check if user is voting on their own content
  if (target.author === caller) {
    throw new ContractError('Cannot vote on your own content');
  }
  
  // Check if user has already voted on this content
  const existingVote = Object.values(state.votes).find(
    (v) => v.targetId === targetId && v.voter === caller
  );
  
  if (existingVote) {
    throw new ContractError('Already voted on this content');
  }
  
  const voteId = `vote-${Date.now()}-${caller.substring(0, 6)}`;
  
  // Create vote
  state.votes[voteId] = {
    id: voteId,
    targetId,
    targetType,
    voter: caller,
    voteType,
    timestamp: Date.now(),
  };
  
  // Update target's vote count
  target.voteCount += voteType === 'up' ? 1 : -1;
  
  // Update reputation
  if (targetType === 'question' || targetType === 'answer') {
    const authorRep = state.users[target.author];
    if (authorRep) {
      authorRep.reputation += voteType === 'up' ? 10 : -2;
    }
    
    // Voter also gets a small amount of reputation for contributing
    state.users[caller].reputation += 1;
  }
  
  return { state, result: { voteId } };
}

/**
 * Create a bounty for a question
 */
function createBounty(
  state: State,
  caller: string,
  questionId: string,
  amount: number
): { state: State; result: { bountyId: string } } {
  // Validate
  if (amount <= 0) {
    throw new ContractError('Bounty amount must be greater than 0');
  }
  
  const question = state.questions[questionId];
  if (!question) {
    throw new ContractError('Question not found');
  }
  
  const bountyId = `bounty-${Date.now()}-${caller.substring(0, 6)}`;
  
  // Create bounty
  state.bounties[bountyId] = {
    id: bountyId,
    questionId,
    sponsor: caller,
    amount,
    timestamp: Date.now(),
    isActive: true,
    isPaid: false,
  };
  
  // Update question's bounty amount
  question.bountyAmount += amount;
  question.bountyId = bountyId;
  
  return { state, result: { bountyId } };
}

/**
 * Award a bounty to an answer author
 */
function awardBounty(
  state: State,
  caller: string,
  bountyId: string,
  recipientAddress: string
): { state: State } {
  const bounty = state.bounties[bountyId];
  if (!bounty) {
    throw new ContractError('Bounty not found');
  }
  
  if (!bounty.isActive) {
    throw new ContractError('Bounty is not active');
  }
  
  if (bounty.sponsor !== caller) {
    throw new ContractError('Only bounty sponsor can award it');
  }
  
  if (!state.users[recipientAddress]) {
    throw new ContractError('Recipient not found');
  }
  
  // Update bounty
  bounty.isActive = false;
  bounty.isPaid = true;
  bounty.paidTo = recipientAddress;
  
  // Update recipient's reputation
  state.users[recipientAddress].reputation += bounty.amount;
  
  return { state };
}

/**
 * Accept an answer to a question
 */
function acceptAnswer(
  state: State,
  caller: string,
  questionId: string,
  answerId: string
): { state: State } {
  const question = state.questions[questionId];
  if (!question) {
    throw new ContractError('Question not found');
  }
  
  if (question.author !== caller) {
    throw new ContractError('Only question author can accept an answer');
  }
  
  if (question.isAccepted) {
    throw new ContractError('Question already has an accepted answer');
  }
  
  const answer = state.answers[answerId];
  if (!answer) {
    throw new ContractError('Answer not found');
  }
  
  if (answer.questionId !== questionId) {
    throw new ContractError('Answer does not belong to this question');
  }
  
  // Update question
  question.isAccepted = true;
  question.acceptedAnswerId = answerId;
  
  // Update answer
  answer.isAccepted = true;
  
  // Award reputation to answer author
  state.users[answer.author].reputation += 15;
  
  return { state };
}

/**
 * Create a DAO proposal
 */
function createDaoProposal(
  state: State,
  caller: string,
  title: string,
  description: string,
  type: 'feature' | 'parameter' | 'bounty' | 'other',
  implementation?: any
): { state: State; result: { proposalId: string } } {
  // Validate
  if (!title || !description) {
    throw new ContractError('Title and description are required');
  }
  
  const user = state.users[caller];
  if (user.reputation < state.daoSettings.reputationThreshold) {
    throw new ContractError(`At least ${state.daoSettings.reputationThreshold} reputation required to create proposal`);
  }
  
  const proposalId = `proposal-${Date.now()}-${caller.substring(0, 6)}`;
  
  // Create proposal
  state.daoProposals[proposalId] = {
    id: proposalId,
    title,
    description,
    proposer: caller,
    timestamp: Date.now(),
    voteEndTimestamp: Date.now() + state.daoSettings.votingPeriodLength,
    votesFor: 0,
    votesAgainst: 0,
    voterAddresses: [],
    type,
    status: 'open',
    implementation,
  };
  
  return { state, result: { proposalId } };
}

/**
 * Vote on a DAO proposal
 */
function voteOnProposal(
  state: State,
  caller: string,
  proposalId: string,
  voteFor: boolean
): { state: State } {
  const proposal = state.daoProposals[proposalId];
  if (!proposal) {
    throw new ContractError('Proposal not found');
  }
  
  if (proposal.status !== 'open') {
    throw new ContractError('Proposal is not open for voting');
  }
  
  if (Date.now() > proposal.voteEndTimestamp) {
    throw new ContractError('Voting period has ended');
  }
  
  if (proposal.voterAddresses.includes(caller)) {
    throw new ContractError('Already voted on this proposal');
  }
  
  // Calculate vote weight based on reputation (1 rep = 1 vote)
  const voteWeight = state.users[caller].reputation;
  
  // Update proposal
  if (voteFor) {
    proposal.votesFor += voteWeight;
  } else {
    proposal.votesAgainst += voteWeight;
  }
  
  proposal.voterAddresses.push(caller);
  
  // Check if voting period is over
  if (Date.now() > proposal.voteEndTimestamp) {
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    
    if (totalVotes >= state.daoSettings.minimumQuorum) {
      proposal.status = proposal.votesFor > proposal.votesAgainst ? 'approved' : 'rejected';
    } else {
      proposal.status = 'rejected'; // Not enough quorum
    }
  }
  
  return { state };
}

/**
 * Implement an approved proposal
 */
function implementProposal(state: State, caller: string, proposalId: string): { state: State } {
  if (caller !== state.owner) {
    throw new ContractError('Only contract owner can implement proposals');
  }
  
  const proposal = state.daoProposals[proposalId];
  if (!proposal) {
    throw new ContractError('Proposal not found');
  }
  
  if (proposal.status !== 'approved') {
    throw new ContractError('Only approved proposals can be implemented');
  }
  
  // Implementation logic would go here, based on proposal type
  
  proposal.status = 'implemented';
  
  return { state };
}

/**
 * Get questions with pagination and sorting
 */
function getQuestions(
  state: State,
  limit: number = 10,
  offset: number = 0,
  sort: 'newest' | 'active' | 'bounty' | 'hot' = 'newest'
): { result: Question[] } {
  const questions = Object.values(state.questions);
  
  // Sort questions
  let sortedQuestions: Question[];
  switch (sort) {
    case 'newest':
      sortedQuestions = questions.sort((a, b) => b.timestamp - a.timestamp);
      break;
    case 'active':
      // Sort by the timestamp of the most recent answer
      sortedQuestions = questions.sort((a, b) => {
        const aLastActivity = a.answerIds.length
          ? Math.max(...a.answerIds.map(id => state.answers[id]?.timestamp || 0))
          : a.timestamp;
        const bLastActivity = b.answerIds.length
          ? Math.max(...b.answerIds.map(id => state.answers[id]?.timestamp || 0))
          : b.timestamp;
        return bLastActivity - aLastActivity;
      });
      break;
    case 'bounty':
      sortedQuestions = questions.sort((a, b) => b.bountyAmount - a.bountyAmount);
      break;
    case 'hot':
      // Combination of recency and vote count
      sortedQuestions = questions.sort(
        (a, b) => b.voteCount + b.timestamp / 1000000 - (a.voteCount + a.timestamp / 1000000)
      );
      break;
    default:
      sortedQuestions = questions.sort((a, b) => b.timestamp - a.timestamp);
  }
  
  // Apply pagination
  const paginatedQuestions = sortedQuestions.slice(offset, offset + limit);
  
  return { result: paginatedQuestions };
}

/**
 * Get a single question with its details
 */
function getQuestion(state: State, questionId: string): { result: any } {
  const question = state.questions[questionId];
  if (!question) {
    throw new ContractError('Question not found');
  }
  
  // Increase view count
  question.viewCount += 1;
  
  // Get answers
  const answers = question.answerIds.map(id => state.answers[id]);
  
  return {
    result: {
      question,
      answers,
      bounty: question.bountyId ? state.bounties[question.bountyId] : null,
    },
  };
}

/**
 * Get user profile
 */
function getUserProfile(state: State, address: string): { result: any } {
  const user = state.users[address];
  if (!user) {
    throw new ContractError('User not found');
  }
  
  // Get user's questions
  const questions = user.questionIds.map(id => state.questions[id]);
  
  // Get user's answers
  const answers = user.answerIds.map(id => state.answers[id]);
  
  return {
    result: {
      user,
      questions,
      answers,
    },
  };
}

/**
 * Update tags (admin only)
 */
function updateTags(state: State, caller: string, tags: string[]): { state: State } {
  if (caller !== state.owner) {
    throw new ContractError('Only contract owner can update tags');
  }
  
  state.tags = tags;
  
  return { state };
}

// Helper contract error class
class ContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContractError';
  }
} 