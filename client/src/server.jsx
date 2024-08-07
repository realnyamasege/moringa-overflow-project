const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const fs = require('fs');
const path = require('path');

// Set CORS options
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

server.use(cors(corsOptions));
server.options('*', cors(corsOptions));
server.use(middlewares);
server.use(jsonServer.bodyParser);

const getUser = (userId) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  return db.users.find(user => user.id === userId);
};

const updateUser = (user) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  const userIndex = db.users.findIndex(u => u.id === user.id);
  if (userIndex !== -1) {
    // Update badges based on reputation points
    const badgeLevels = [
      { name: "New Member", points: 0 },
      { name: "Contributor", points: 50 },
      { name: "Active", points: 100 },
      { name: "Helper", points: 150 },
      { name: "Leader", points: 200 },
      { name: "Veteran", points: 300 }
    ];
    user.badges = badgeLevels
      .filter(level => user.reputation_points >= level.points)
      .map(level => level.name);

    db.users[userIndex] = user;
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db));
  }
};

server.post('/ask-question', (req, res) => {
  const { userId, title, content, tags, codeSnippet, link } = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  const user = getUser(userId);
  if (user) {
    const newQuestion = {
      id: Date.now().toString(),
      userId,
      title,
      content,
      tags,
      codeSnippet,
      link,
      comments: [],
      upvotes: 0,
      downvotes: 0,
      awards: 0,
      resolved: false,
      answers: []
    };
    db.questions.push(newQuestion);
    user.reputation_points += 5;
    updateUser(user);
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db));
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

server.post('/answer-question', (req, res) => {
  const { userId, questionId, answer, link } = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  const user = getUser(userId);
  if (user) {
    const newAnswer = {
      id: Date.now().toString(),
      userId,
      questionId,
      answer,
      link,
      upvotes: 0,
      downvotes: 0,
      accepted: false
    };
    const questionIndex = db.questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      db.questions[questionIndex].answers.push(newAnswer);
      user.reputation_points += 5;
      updateUser(user);
      fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db));
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Question not found' });
    }
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

server.post('/mark-answer-correct', (req, res) => {
  const { userId, questionId, answerId } = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  const user = getUser(userId);
  const question = db.questions.find(q => q.id === questionId);
  const answer = question?.answers.find(ans => ans.id === answerId);
  if (user && question && answer) {
    answer.accepted = true;
    question.resolved = true;
    const answerUser = getUser(answer.userId);
    if (answerUser) {
      answerUser.reputation_points += 5;
      updateUser(answerUser);
      fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db));
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Answer user not found' });
    }
  } else {
    res.status(404).json({ error: 'User, question, or answer not found' });
  }
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
});
