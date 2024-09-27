"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkPackageServiceStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
const iam = require("aws-cdk-lib/aws-iam");
const awscdk_appsync_utils_1 = require("awscdk-appsync-utils");
const aws_appsync_1 = require("aws-cdk-lib/aws-appsync");
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const CURRENT_DATE = new Date();
const KEY_EXPIRATION_DATE = new Date(CURRENT_DATE.getTime() + SEVEN_DAYS);
class CdkPackageServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        //create our API
        const api = new appsync.GraphqlApi(this, "payment-service-api", {
            name: "paymentServiceAPI",
            definition: appsync.Definition.fromFile("./schema/schema.graphql"),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.API_KEY,
                    apiKeyConfig: {
                        name: "default",
                        description: "default auth mode",
                        expires: cdk.Expiration.atDate(KEY_EXPIRATION_DATE),
                    },
                },
            },
            logConfig: {
                fieldLogLevel: appsync.FieldLogLevel.ALL,
            },
            xrayEnabled: true,
        });
        const paymentsAPIDatasource = api.addHttpDataSource("paymentService", "http://payment-service-ALB-99682079.us-east-2.elb.amazonaws.com");
        /********************************************************************************************************
     *      Merge Api Execution Rule
     */
        const roleArn = this.node.tryGetContext('roleArn');
        const mergedApiExecutionRole = iam.Role.fromRoleArn(this, 'MergedApiExecutionRole', roleArn);
        const mergedApiArn = this.node.tryGetContext('mergedApiArn');
        const mergedApiId = this.node.tryGetContext('mergedApiId');
        const mergedApi = aws_appsync_1.GraphqlApi.fromGraphqlApiAttributes(this, 'MergedApi', {
            graphqlApiArn: mergedApiArn,
            graphqlApiId: mergedApiId,
        });
        /********************************************************************************************************
         *      Associates this api to the MergedApi
         */
        const sourceApiAssociation = new aws_appsync_1.SourceApiAssociation(this, 'PackageSourceApiAssociation', {
            sourceApi: api,
            mergedApi: mergedApi,
            mergedApiExecutionRole: mergedApiExecutionRole,
            mergeType: aws_appsync_1.MergeType.MANUAL_MERGE,
        });
        new awscdk_appsync_utils_1.SourceApiAssociationMergeOperation(this, 'SourceApiMergeOperation', {
            sourceApiAssociation: sourceApiAssociation,
            alwaysMergeOnStackUpdate: true
        });
        new appsync.Resolver(this, "createPaymentResolver", {
            api,
            typeName: "Mutation",
            fieldName: "createPaymentIntent",
            dataSource: paymentsAPIDatasource,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/payments-service/createPayment.js"),
        });
        new appsync.Resolver(this, "confirmPaymentResolver", {
            api,
            typeName: "Mutation",
            fieldName: "confirmPayment",
            dataSource: paymentsAPIDatasource,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/payments-service/confirmPayment.js"),
        });
        new appsync.Resolver(this, "cancelPaymentResolver", {
            api,
            typeName: "Mutation",
            fieldName: "cancelPayment",
            dataSource: paymentsAPIDatasource,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/payments-service/cancelPayment.js"),
        });
        new appsync.Resolver(this, "getPaymentResolver", {
            api,
            typeName: "Query",
            fieldName: "getPayment",
            dataSource: paymentsAPIDatasource,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/payments-service/getPayment.js"),
        });
        //////////////////////////
        new cdk.CfnOutput(this, "appsync api key", {
            value: api.apiKey,
        });
        new cdk.CfnOutput(this, "appsync endpoint", {
            value: api.graphqlUrl,
        });
        new cdk.CfnOutput(this, "appsync apiId", {
            value: api.apiId,
        });
    }
}
exports.CdkPackageServiceStack = CdkPackageServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBhY2thZ2Utc2VydmljZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNkay1wYWNrYWdlLXNlcnZpY2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLG1EQUFtRDtBQUNuRCwyQ0FBMkM7QUFDM0MsK0RBQTBFO0FBQzFFLHlEQUFzRjtBQUt0RixNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMseUJBQXlCO0FBQ3JFLE1BQU0sWUFBWSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDaEMsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUM7QUFFMUUsTUFBYSxzQkFBdUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNuRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLGdCQUFnQjtRQUNoQixNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQzlELElBQUksRUFBRSxtQkFBbUI7WUFDekIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDO1lBQ2xFLG1CQUFtQixFQUFFO2dCQUNuQixvQkFBb0IsRUFBRTtvQkFDcEIsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU87b0JBQ3BELFlBQVksRUFBRTt3QkFDWixJQUFJLEVBQUUsU0FBUzt3QkFDZixXQUFXLEVBQUUsbUJBQW1CO3dCQUNoQyxPQUFPLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUM7cUJBQ3BE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O1lBQ3pDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FDMUIsNENBQTRDLENBQzdDO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsMEJBQTBCO1FBQzFCLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDekMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFPO1NBQ25CLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDMUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVO1NBQ3RCLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3ZDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSztTQUNqQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFwSEQsd0RBb0hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1hcHBzeW5jXCI7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcbmltcG9ydCB7IFNvdXJjZUFwaUFzc29jaWF0aW9uTWVyZ2VPcGVyYXRpb24gfSBmcm9tIFwiYXdzY2RrLWFwcHN5bmMtdXRpbHNcIjtcbmltcG9ydCB7IEdyYXBocWxBcGksIFNvdXJjZUFwaUFzc29jaWF0aW9uLCBNZXJnZVR5cGUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwcHN5bmNcIjtcblxuXG5pbXBvcnQgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuaW1wb3J0IHByb2Nlc3MgPSByZXF1aXJlKFwicHJvY2Vzc1wiKTtcbmNvbnN0IFNFVkVOX0RBWVMgPSA3ICogMjQgKiA2MCAqIDYwICogMTAwMDsgLy8gNyBkYXlzIGluIG1pbGxpc2Vjb25kc1xuY29uc3QgQ1VSUkVOVF9EQVRFID0gbmV3IERhdGUoKTtcbmNvbnN0IEtFWV9FWFBJUkFUSU9OX0RBVEUgPSBuZXcgRGF0ZShDVVJSRU5UX0RBVEUuZ2V0VGltZSgpICsgU0VWRU5fREFZUyk7XG5cbmV4cG9ydCBjbGFzcyBDZGtQYWNrYWdlU2VydmljZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy9jcmVhdGUgb3VyIEFQSVxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgXCJwYXltZW50LXNlcnZpY2UtYXBpXCIsIHtcbiAgICAgIG5hbWU6IFwicGF5bWVudFNlcnZpY2VBUElcIixcbiAgICAgIGRlZmluaXRpb246IGFwcHN5bmMuRGVmaW5pdGlvbi5mcm9tRmlsZShcIi4vc2NoZW1hL3NjaGVtYS5ncmFwaHFsXCIpLFxuICAgICAgYXV0aG9yaXphdGlvbkNvbmZpZzoge1xuICAgICAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVksXG4gICAgICAgICAgYXBpS2V5Q29uZmlnOiB7XG4gICAgICAgICAgICBuYW1lOiBcImRlZmF1bHRcIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcImRlZmF1bHQgYXV0aCBtb2RlXCIsXG4gICAgICAgICAgICBleHBpcmVzOiBjZGsuRXhwaXJhdGlvbi5hdERhdGUoS0VZX0VYUElSQVRJT05fREFURSksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBsb2dDb25maWc6IHtcbiAgICAgICAgZmllbGRMb2dMZXZlbDogYXBwc3luYy5GaWVsZExvZ0xldmVsLkFMTCxcbiAgICAgIH0sXG4gICAgICB4cmF5RW5hYmxlZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBheW1lbnRzQVBJRGF0YXNvdXJjZSA9IGFwaS5hZGRIdHRwRGF0YVNvdXJjZShcbiAgICAgIFwicGF5bWVudFNlcnZpY2VcIixcbiAgICAgIFwiaHR0cDovL3BheW1lbnQtc2VydmljZS1BTEItOTk2ODIwNzkudXMtZWFzdC0yLmVsYi5hbWF6b25hd3MuY29tXCJcbiAgICApO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiAgICAgIE1lcmdlIEFwaSBFeGVjdXRpb24gUnVsZVxuICovXG4gICAgY29uc3Qgcm9sZUFybiA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdyb2xlQXJuJyk7XG4gICAgY29uc3QgbWVyZ2VkQXBpRXhlY3V0aW9uUm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHRoaXMsICdNZXJnZWRBcGlFeGVjdXRpb25Sb2xlJyxcbiAgICAgIHJvbGVBcm4pXG5cbiAgICBjb25zdCBtZXJnZWRBcGlBcm4gPSB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dCgnbWVyZ2VkQXBpQXJuJyk7XG4gICAgY29uc3QgbWVyZ2VkQXBpSWQgPSB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dCgnbWVyZ2VkQXBpSWQnKTtcblxuXG4gICAgY29uc3QgbWVyZ2VkQXBpID0gR3JhcGhxbEFwaS5mcm9tR3JhcGhxbEFwaUF0dHJpYnV0ZXModGhpcywgJ01lcmdlZEFwaScsIHtcbiAgICAgIGdyYXBocWxBcGlBcm46IG1lcmdlZEFwaUFybixcbiAgICAgIGdyYXBocWxBcGlJZDogbWVyZ2VkQXBpSWQsXG4gICAgfSk7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiAgICAgIEFzc29jaWF0ZXMgdGhpcyBhcGkgdG8gdGhlIE1lcmdlZEFwaVxuICAgICAqL1xuICAgIGNvbnN0IHNvdXJjZUFwaUFzc29jaWF0aW9uID0gbmV3IFNvdXJjZUFwaUFzc29jaWF0aW9uKHRoaXMsICdQYWNrYWdlU291cmNlQXBpQXNzb2NpYXRpb24nLCB7XG4gICAgICBzb3VyY2VBcGk6IGFwaSxcbiAgICAgIG1lcmdlZEFwaTogbWVyZ2VkQXBpLFxuICAgICAgbWVyZ2VkQXBpRXhlY3V0aW9uUm9sZTogbWVyZ2VkQXBpRXhlY3V0aW9uUm9sZSxcbiAgICAgIG1lcmdlVHlwZTogTWVyZ2VUeXBlLk1BTlVBTF9NRVJHRSxcbiAgICB9KTtcblxuICAgIG5ldyBTb3VyY2VBcGlBc3NvY2lhdGlvbk1lcmdlT3BlcmF0aW9uKHRoaXMsICdTb3VyY2VBcGlNZXJnZU9wZXJhdGlvbicsIHtcbiAgICAgIHNvdXJjZUFwaUFzc29jaWF0aW9uOiBzb3VyY2VBcGlBc3NvY2lhdGlvbixcbiAgICAgIGFsd2F5c01lcmdlT25TdGFja1VwZGF0ZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJjcmVhdGVQYXltZW50UmVzb2x2ZXJcIiwge1xuICAgICAgYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJjcmVhdGVQYXltZW50SW50ZW50XCIsXG4gICAgICBkYXRhU291cmNlOiBwYXltZW50c0FQSURhdGFzb3VyY2UsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXG4gICAgICAgIFwiLi9yZXNvbHZlcnMvcGF5bWVudHMtc2VydmljZS9jcmVhdGVQYXltZW50LmpzXCJcbiAgICAgICksXG4gICAgfSk7XG5cbiAgICBuZXcgYXBwc3luYy5SZXNvbHZlcih0aGlzLCBcImNvbmZpcm1QYXltZW50UmVzb2x2ZXJcIiwge1xuICAgICAgYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJjb25maXJtUGF5bWVudFwiLFxuICAgICAgZGF0YVNvdXJjZTogcGF5bWVudHNBUElEYXRhc291cmNlLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFxuICAgICAgICBcIi4vcmVzb2x2ZXJzL3BheW1lbnRzLXNlcnZpY2UvY29uZmlybVBheW1lbnQuanNcIlxuICAgICAgKSxcbiAgICB9KTtcblxuICAgIG5ldyBhcHBzeW5jLlJlc29sdmVyKHRoaXMsIFwiY2FuY2VsUGF5bWVudFJlc29sdmVyXCIsIHtcbiAgICAgIGFwaSxcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwiY2FuY2VsUGF5bWVudFwiLFxuICAgICAgZGF0YVNvdXJjZTogcGF5bWVudHNBUElEYXRhc291cmNlLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFxuICAgICAgICBcIi4vcmVzb2x2ZXJzL3BheW1lbnRzLXNlcnZpY2UvY2FuY2VsUGF5bWVudC5qc1wiXG4gICAgICApLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJnZXRQYXltZW50UmVzb2x2ZXJcIiwge1xuICAgICAgYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiUXVlcnlcIixcbiAgICAgIGZpZWxkTmFtZTogXCJnZXRQYXltZW50XCIsXG4gICAgICBkYXRhU291cmNlOiBwYXltZW50c0FQSURhdGFzb3VyY2UsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXG4gICAgICAgIFwiLi9yZXNvbHZlcnMvcGF5bWVudHMtc2VydmljZS9nZXRQYXltZW50LmpzXCJcbiAgICAgICksXG4gICAgfSk7XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcImFwcHN5bmMgYXBpIGtleVwiLCB7XG4gICAgICB2YWx1ZTogYXBpLmFwaUtleSEsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcImFwcHN5bmMgZW5kcG9pbnRcIiwge1xuICAgICAgdmFsdWU6IGFwaS5ncmFwaHFsVXJsLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJhcHBzeW5jIGFwaUlkXCIsIHtcbiAgICAgIHZhbHVlOiBhcGkuYXBpSWQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==