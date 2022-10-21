

const FIELD_NAME = "listField";
const DEFAULT_CONFIG = {
    "collection": "listCollection",
    "database": "listDB",
    "dataSource": "Cluster0",
}

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key': '5FRvEylo6N9H5lHuxTeUW3yIfkUd1dOqv1166uBZj8Wm5TGRr4fQNRHERsgjKeQX',
}

const urlDB = "https://data.mongodb-api.com/app/data-wbtfr/endpoint/data/v1";

export const configDelete = {
    method: 'post',
    url: `${urlDB}/action/deleteOne`,
    headers,
    data: JSON.stringify({
        ...DEFAULT_CONFIG,
        "filter": { "name": FIELD_NAME }
    }),
};

export const getConfigPOST = (list) => ({
    method: 'post',
    url: `${urlDB}/action/insertOne`,
    headers,
    data: JSON.stringify({
        ...DEFAULT_CONFIG,
        "document": {
            "name": FIELD_NAME,
            "list": list
        }
    }),
});

export const getConfigGET = () => ({
    method: 'post',
    url: `${urlDB}/action/findOne`,
    headers,
    data: JSON.stringify({
        ...DEFAULT_CONFIG,
        "filter": { "name": FIELD_NAME }
    }),
});