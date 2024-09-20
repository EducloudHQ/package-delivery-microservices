"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryServiceStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
const events = require("aws-cdk-lib/aws-events");
class DeliveryServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        //create our API
        const api = new appsync.GraphqlApi(this, "DeliveryAPI", {
            name: "DeliveryAPI",
            definition: appsync.Definition.fromFile("./schema/schema.graphql"),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.API_KEY,
                },
                additionalAuthorizationModes: [
                    {
                        authorizationType: appsync.AuthorizationType.IAM, // Additional IAM authorization
                    },
                ],
            },
            logConfig: {
                fieldLogLevel: appsync.FieldLogLevel.ALL,
            },
            xrayEnabled: true,
        });
        const eventBus = events.EventBus.fromEventBusArn(this, "eventBus", "arn:aws:events:us-east-1:132260253285:event-bus/PackageEventBus");
        const eventBridgeDs = api.addEventBridgeDataSource('EventBridge', eventBus);
        const putEvent = new appsync.AppsyncFunction(this, 'PutEvent', {
            api: api,
            name: 'PutEvent',
            dataSource: eventBridgeDs,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset('./resolvers/delivery/putEvent.js'),
        });
        new appsync.Resolver(this, "packageDelivereddResolver", {
            api,
            typeName: "Mutation",
            fieldName: "packageDelivered",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
            pipelineConfig: [putEvent],
        });
    }
}
exports.DeliveryServiceStack = DeliveryServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsaXZlcnlfc2VydmljZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlbGl2ZXJ5X3NlcnZpY2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLG1EQUFtRDtBQUNuRCxpREFBaUQ7QUFLakQsTUFBYSxvQkFBcUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNqRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLGdCQUFnQjtRQUNoQixNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUN0RCxJQUFJLEVBQUUsYUFBYTtZQUNuQixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUM7WUFDbEUsbUJBQW1CLEVBQUU7Z0JBQ25CLG9CQUFvQixFQUFFO29CQUNwQixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTztpQkFDckQ7Z0JBQ0QsNEJBQTRCLEVBQUU7b0JBQzVCO3dCQUNFLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUssK0JBQStCO3FCQUNyRjtpQkFDRjthQUNGO1lBQ0QsU0FBUyxFQUFFO2dCQUNULGFBQWEsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUc7YUFDekM7WUFDRCxXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGlFQUFpRSxDQUFDLENBQUE7UUFFckksTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLHdCQUF3QixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1RSxNQUFNLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM3RCxHQUFHLEVBQUUsR0FBRztZQUNSLElBQUksRUFBRSxVQUFVO1lBQ2hCLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLE9BQU8sRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVE7WUFDekMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUFDO1NBQ2pFLENBQUMsQ0FBQztRQUVILElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsMkJBQTJCLEVBQUU7WUFDdEQsR0FBRztZQUNILFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtZQUN6QyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsaUNBQWlDLENBQUM7WUFDL0QsY0FBYyxFQUFFLENBQUMsUUFBUSxDQUFDO1NBQzNCLENBQUMsQ0FBQztJQUVMLENBQUM7Q0FDRjtBQTVDRCxvREE0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBwc3luY1wiO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBfZHluYW1vZGIgZnJvbSBcImF3cy1jZGstbGliL2F3cy1keW5hbW9kYlwiXG5pbXBvcnQgKiBhcyBfbG1hYmRhIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCJcbmltcG9ydCAqIGFzIF90YXJnZXQgZnJvbSBcImF3cy1jZGstbGliL2F3cy1ldmVudHMtdGFyZ2V0c1wiO1xuXG5leHBvcnQgY2xhc3MgRGVsaXZlcnlTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvL2NyZWF0ZSBvdXIgQVBJXG4gICAgY29uc3QgYXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCBcIkRlbGl2ZXJ5QVBJXCIsIHtcbiAgICAgIG5hbWU6IFwiRGVsaXZlcnlBUElcIixcbiAgICAgIGRlZmluaXRpb246IGFwcHN5bmMuRGVmaW5pdGlvbi5mcm9tRmlsZShcIi4vc2NoZW1hL3NjaGVtYS5ncmFwaHFsXCIpLFxuICAgICAgYXV0aG9yaXphdGlvbkNvbmZpZzoge1xuICAgICAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVksXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5JQU0sICAgIC8vIEFkZGl0aW9uYWwgSUFNIGF1dGhvcml6YXRpb25cbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGxvZ0NvbmZpZzoge1xuICAgICAgICBmaWVsZExvZ0xldmVsOiBhcHBzeW5jLkZpZWxkTG9nTGV2ZWwuQUxMLFxuICAgICAgfSxcbiAgICAgIHhyYXlFbmFibGVkOiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnN0IGV2ZW50QnVzID0gZXZlbnRzLkV2ZW50QnVzLmZyb21FdmVudEJ1c0Fybih0aGlzLCBcImV2ZW50QnVzXCIsIFwiYXJuOmF3czpldmVudHM6dXMtZWFzdC0xOjEzMjI2MDI1MzI4NTpldmVudC1idXMvUGFja2FnZUV2ZW50QnVzXCIpXG5cbiAgICBjb25zdCBldmVudEJyaWRnZURzID0gYXBpLmFkZEV2ZW50QnJpZGdlRGF0YVNvdXJjZSgnRXZlbnRCcmlkZ2UnLCBldmVudEJ1cyk7XG4gICAgY29uc3QgcHV0RXZlbnQgPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24odGhpcywgJ1B1dEV2ZW50Jywge1xuICAgICAgYXBpOiBhcGksXG4gICAgICBuYW1lOiAnUHV0RXZlbnQnLFxuICAgICAgZGF0YVNvdXJjZTogZXZlbnRCcmlkZ2VEcyxcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldCgnLi9yZXNvbHZlcnMvZGVsaXZlcnkvcHV0RXZlbnQuanMnKSxcbiAgICB9KTtcblxuICAgIG5ldyBhcHBzeW5jLlJlc29sdmVyKHRoaXMsIFwicGFja2FnZURlbGl2ZXJlZGRSZXNvbHZlclwiLCB7XG4gICAgICBhcGksXG4gICAgICB0eXBlTmFtZTogXCJNdXRhdGlvblwiLFxuICAgICAgZmllbGROYW1lOiBcInBhY2thZ2VEZWxpdmVyZWRcIixcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BpcGVsaW5lL2RlZmF1bHQuanNcIiksXG4gICAgICBwaXBlbGluZUNvbmZpZzogW3B1dEV2ZW50XSxcbiAgICB9KTtcblxuICB9XG59XG5cblxuIl19