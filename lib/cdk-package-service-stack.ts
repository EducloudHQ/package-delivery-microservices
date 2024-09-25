import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";

import path = require("path");
import process = require("process");
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const CURRENT_DATE = new Date();
const KEY_EXPIRATION_DATE = new Date(CURRENT_DATE.getTime() + SEVEN_DAYS);

export class CdkPackageServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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
        fieldLogLevel: appsync.FieldLogLevel.DEBUG,
      },
      xrayEnabled: true,
    });

    const paymentsAPIDatasource = api.addHttpDataSource(
      "paymentService",
      "http://payment-service-ALB-99682079.us-east-2.elb.amazonaws.com"
    );

    new appsync.Resolver(this, "createPaymentResolver", {
      api,
      typeName: "Mutation",
      fieldName: "createPayment",
      dataSource: paymentsAPIDatasource,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        "./resolvers/payments-service/createPayment.js"
      ),
    });

    new appsync.Resolver(this, "confirmPaymentResolver", {
      api,
      typeName: "Mutation",
      fieldName: "confirmPayment",
      dataSource: paymentsAPIDatasource,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        "./resolvers/payments-service/confirmPayment.js"
      ),
    });

    new appsync.Resolver(this, "cancelPaymentResolver", {
      api,
      typeName: "Mutation",
      fieldName: "cancelPayment",
      dataSource: paymentsAPIDatasource,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        "./resolvers/payments-service/cancelPayment.js"
      ),
    });

    new appsync.Resolver(this, "getPaymentResolver", {
      api,
      typeName: "Query",
      fieldName: "getPayment",
      dataSource: paymentsAPIDatasource,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        "./resolvers/payments-service/getPayment.js"
      ),
    });
    //////////////////////////
    new cdk.CfnOutput(this, "appsync api key", {
      value: api.apiKey!,
    });

    new cdk.CfnOutput(this, "appsync endpoint", {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, "appsync apiId", {
      value: api.apiId,
    });
  }
}