const fetch = require("node-fetch");

exports.handler = async function (event) {
  const body = JSON.parse(event.body);
  const genre = body.genre;
  const pageState = body.pageState;
  const url = process.env.CASSANDRA_GRAPHQL_ENDPOINT;

  const query = `
        query getMoviesByGenre {
            movies_by_genre (
                value: {genre: ${JSON.stringify(genre)} },
                orderBy: [year_DESC],
                options: {
                    pageSize: 3,
                    pageState: ${JSON.stringify(pageState)}
                }) {
                values {
                    title,
                    duration,
                    synopsis,
                    thumbnail,
                    year
                },
                pageState
            }
        }
    `;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cassandra-token":
        "AstraCS:rBkoxdBJrMSGxCutTFXhwZJd:e792c05d14dd9330927ef5ad15e68d639598a078893151a08cc8063fe9d27788",
    },
    body: JSON.stringify({ query }),
  });

  try {
    const responseBody = await response.json();
    console.log("responseBody", responseBody);
    return {
      statusCode: 200,
      body: JSON.stringify(responseBody),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};
