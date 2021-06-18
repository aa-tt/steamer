const fetch = require("node-fetch");

exports.handler = async function (event) {
  const limit = JSON.parse(event.body);
  const url = process.env.CASSANDRA_GRAPHQL_ENDPOINT;

  const query = `
        query getAllGenres {
            reference_list(
                value: {label:"genre"},
                options: { limit: ${JSON.stringify(limit)} }) {
                values{value}
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
    return {
      statusCode: 200,
      body: JSON.stringify(responseBody),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};
