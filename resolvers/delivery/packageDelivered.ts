import * as https from 'https';

const GRAPHQL_URL = 'https://jdn5r77ayreltfaybji65a2ocq.appsync-api.us-east-1.amazonaws.com/graphql';
const GRAPHQL_API_KEY = 'da2-wfvmdokvife4lkl7piehsz4cmu'; // Secret

// Set up the headers for the GraphQL request
const HEADERS = {
    "Content-Type": "application/json",
    "X-Api-Key": GRAPHQL_API_KEY
};

// Lambda handler function
export const lambdaHandler = async (event: any) => {
    console.log("Incoming Event>>>>>>", event);
    console.log("Incoming Event>>>>>>", event.arguments);
            const data = JSON.stringify({
                operationName: null,
                variables: {
                    id: event.arguments.packageId
                },
                query: `mutation packageDelivered {
                    packageDelivered(packageId: ${event.arguments.packageId}) {
                        id
                    }
                }`
            });

            try {
                console.log("I'm Here")
                const response = await makeGraphqlRequest(data);
                console.log('GraphQL request response: ', response);
            } catch (error) {
                console.error('Error: ', error);
            }

    return `Successfully processed ${event.arguments} records.`;
};
const makeGraphqlRequest = (data: string) => {
    console.log("About to make a request")
    return new Promise((resolve, reject) => {
        const url = new URL(GRAPHQL_URL);

        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'POST',
            headers: {
                ...HEADERS,
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(responseData));
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
};
