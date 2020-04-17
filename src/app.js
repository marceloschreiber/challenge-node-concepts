const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status-codes");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getRepositoryIndex(id) {
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    throw new Error("Repository not found");
  }

  return repositoryIndex;
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(httpStatus.CREATED).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  try {
    const repositoryIndex = getRepositoryIndex(id);

    const repository = {
      ...repositories[repositoryIndex],
      title,
      url,
      techs,
    };

    return response.json(repository);
  } catch (err) {
    return response.status(httpStatus.BAD_REQUEST).json(err.message);
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  try {
    const repositoryIndex = getRepositoryIndex(id);
    repositories.splice(repositoryIndex, 1);

    return response.status(httpStatus.NO_CONTENT).send();
  } catch (err) {
    return response.status(httpStatus.BAD_REQUEST).json(err.message);
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  try {
    const repositoryIndex = getRepositoryIndex(id);
    const repository = repositories[repositoryIndex];

    const repositoryWithLikeIncremented = {
      ...repository,
      likes: repository.likes + 1,
    };

    repositories[repositoryIndex] = repositoryWithLikeIncremented;

    return response.json(repositoryWithLikeIncremented);
  } catch (err) {
    return response.status(httpStatus.BAD_REQUEST).json(err.message);
  }
});

module.exports = app;
