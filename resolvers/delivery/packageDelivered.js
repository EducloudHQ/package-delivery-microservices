"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const https = require("https");
const GRAPHQL_URL = 'https://jdn5r77ayreltfaybji65a2ocq.appsync-api.us-east-1.amazonaws.com/graphql';
const GRAPHQL_API_KEY = 'da2-wfvmdokvife4lkl7piehsz4cmu'; // Secret
// Set up the headers for the GraphQL request
const HEADERS = {
    "Content-Type": "application/json",
    "X-Api-Key": GRAPHQL_API_KEY
};
// Lambda handler function
const lambdaHandler = async (event) => {
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
        console.log("I'm Here");
        const response = await makeGraphqlRequest(data);
        console.log('GraphQL request response: ', response);
    }
    catch (error) {
        console.error('Error: ', error);
    }
    return `Successfully processed ${event.arguments} records.`;
};
exports.lambdaHandler = lambdaHandler;
const makeGraphqlRequest = (data) => {
    console.log("About to make a request");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZURlbGl2ZXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhY2thZ2VEZWxpdmVyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0JBQStCO0FBRS9CLE1BQU0sV0FBVyxHQUFHLGdGQUFnRixDQUFDO0FBQ3JHLE1BQU0sZUFBZSxHQUFHLGdDQUFnQyxDQUFDLENBQUMsU0FBUztBQUVuRSw2Q0FBNkM7QUFDN0MsTUFBTSxPQUFPLEdBQUc7SUFDWixjQUFjLEVBQUUsa0JBQWtCO0lBQ2xDLFdBQVcsRUFBRSxlQUFlO0NBQy9CLENBQUM7QUFFRiwwQkFBMEI7QUFDbkIsTUFBTSxhQUFhLEdBQUcsS0FBSyxFQUFFLEtBQVUsRUFBRSxFQUFFO0lBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixhQUFhLEVBQUUsSUFBSTtRQUNuQixTQUFTLEVBQUU7WUFDUCxFQUFFLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTO1NBQ2hDO1FBQ0QsS0FBSyxFQUFFO2tEQUMyQixLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVM7OztrQkFHekQ7S0FDTCxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUM7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ3ZCLE1BQU0sUUFBUSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFVCxPQUFPLDBCQUEwQixLQUFLLENBQUMsU0FBUyxXQUFXLENBQUM7QUFDaEUsQ0FBQyxDQUFDO0FBeEJXLFFBQUEsYUFBYSxpQkF3QnhCO0FBQ0YsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO0lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQTtJQUN0QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ25DLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWpDLE1BQU0sT0FBTyxHQUFHO1lBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO1lBQ3RCLElBQUksRUFBRSxHQUFHLENBQUMsUUFBUTtZQUNsQixNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRTtnQkFDTCxHQUFHLE9BQU87Z0JBQ1YsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDaEM7U0FDSixDQUFDO1FBRUYsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN2QyxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7WUFFdEIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDckIsWUFBWSxJQUFJLEtBQUssQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztZQUVILEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtnQkFDZixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2QsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBodHRwcyBmcm9tICdodHRwcyc7XG5cbmNvbnN0IEdSQVBIUUxfVVJMID0gJ2h0dHBzOi8vamRuNXI3N2F5cmVsdGZheWJqaTY1YTJvY3EuYXBwc3luYy1hcGkudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vZ3JhcGhxbCc7XG5jb25zdCBHUkFQSFFMX0FQSV9LRVkgPSAnZGEyLXdmdm1kb2t2aWZlNGxrbDdwaWVoc3o0Y211JzsgLy8gU2VjcmV0XG5cbi8vIFNldCB1cCB0aGUgaGVhZGVycyBmb3IgdGhlIEdyYXBoUUwgcmVxdWVzdFxuY29uc3QgSEVBREVSUyA9IHtcbiAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICBcIlgtQXBpLUtleVwiOiBHUkFQSFFMX0FQSV9LRVlcbn07XG5cbi8vIExhbWJkYSBoYW5kbGVyIGZ1bmN0aW9uXG5leHBvcnQgY29uc3QgbGFtYmRhSGFuZGxlciA9IGFzeW5jIChldmVudDogYW55KSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJJbmNvbWluZyBFdmVudD4+Pj4+PlwiLCBldmVudCk7XG4gICAgY29uc29sZS5sb2coXCJJbmNvbWluZyBFdmVudD4+Pj4+PlwiLCBldmVudC5hcmd1bWVudHMpO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25OYW1lOiBudWxsLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlczoge1xuICAgICAgICAgICAgICAgICAgICBpZDogZXZlbnQuYXJndW1lbnRzLnBhY2thZ2VJZFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcXVlcnk6IGBtdXRhdGlvbiBwYWNrYWdlRGVsaXZlcmVkIHtcbiAgICAgICAgICAgICAgICAgICAgcGFja2FnZURlbGl2ZXJlZChwYWNrYWdlSWQ6ICR7ZXZlbnQuYXJndW1lbnRzLnBhY2thZ2VJZH0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9YFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJJ20gSGVyZVwiKVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgbWFrZUdyYXBocWxSZXF1ZXN0KGRhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHcmFwaFFMIHJlcXVlc3QgcmVzcG9uc2U6ICcsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6ICcsIGVycm9yKTtcbiAgICAgICAgICAgIH1cblxuICAgIHJldHVybiBgU3VjY2Vzc2Z1bGx5IHByb2Nlc3NlZCAke2V2ZW50LmFyZ3VtZW50c30gcmVjb3Jkcy5gO1xufTtcbmNvbnN0IG1ha2VHcmFwaHFsUmVxdWVzdCA9IChkYXRhOiBzdHJpbmcpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkFib3V0IHRvIG1ha2UgYSByZXF1ZXN0XCIpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChHUkFQSFFMX1VSTCk7XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGhvc3RuYW1lOiB1cmwuaG9zdG5hbWUsXG4gICAgICAgICAgICBwYXRoOiB1cmwucGF0aG5hbWUsXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAuLi5IRUFERVJTLFxuICAgICAgICAgICAgICAgICdDb250ZW50LUxlbmd0aCc6IGRhdGEubGVuZ3RoXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgcmVxID0gaHR0cHMucmVxdWVzdChvcHRpb25zLCAocmVzKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2VEYXRhID0gJyc7XG5cbiAgICAgICAgICAgIHJlcy5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGF0YSArPSBjaHVuaztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXMub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UocmVzcG9uc2VEYXRhKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVxLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVxLndyaXRlKGRhdGEpO1xuICAgICAgICByZXEuZW5kKCk7XG4gICAgfSk7XG59O1xuIl19