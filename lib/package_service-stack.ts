import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as events from "aws-cdk-lib/aws-events";
import * as _dynamodb from "aws-cdk-lib/aws-dynamodb"
import path = require("path");
import * as _target from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";


export class PackageServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    /********************************************************************************************************
     *      Create the dynamodb table
     */

    const packageTable = new _dynamodb.Table(this, "PackageTable", {
      tableName: "packageTable",
      partitionKey: {
        name: "PK",
        type: _dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: _dynamodb.AttributeType.STRING,
      },
      billingMode: _dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: _dynamodb.StreamViewType.NEW_IMAGE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    /********************************************************************************************************
     *      Add a global secondary index
     */

    packageTable.addGlobalSecondaryIndex({
      indexName: "package-timelapse-index",
      partitionKey: {
        name: "GSI1_PK",
        type: _dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI1_SK",
        type: _dynamodb.AttributeType.STRING,
      },
      projectionType: _dynamodb.ProjectionType.ALL,
    });
    

    /********************************************************************************************************
     *      Create the GraphQl Api
     */
    const api = new appsync.GraphqlApi(this, "PackageAPI", {
      name: "PackageAPI",
      definition: appsync.Definition.fromFile("./schema/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.IAM,    // Additional IAM authorization
          },
        ],
      },
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      xrayEnabled: true,
    });

    api.addEnvironmentVariable("TABLE_NAME", packageTable.tableName);

    /********************************************************************************************************
     *      Create an EventBus
     */
    const eventBus = new events.EventBus(this, "PackageEventBus", {
      eventBusName: "PackageEventBus",
    });

    /********************************************************************************************************
     *      Add Dynamodb and EventBridge Datasource to the Api
     */
    const packageDatasource = api.addDynamoDbDataSource("PackageDatasource", packageTable)
    const eventBridgeDs = api.addEventBridgeDataSource('EventBridge', eventBus);
    const noneDatasource = api.addNoneDataSource('NoneDataSource');


    /********************************************************************************************************
     *      EveentBridge Function
     */
    const putEvent = new appsync.AppsyncFunction(this, 'PutEvent', {
      api: api,
      name: 'PutEvent',
      dataSource: eventBridgeDs,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset('./resolvers/package/putEvent.js'),
    });

    /********************************************************************************************************
     *      Appsync Functions
     */
    const createPackageFunction = new appsync.AppsyncFunction(this, "createPackageFunction", {
      api,
      name: "createPackageFunction",
      dataSource: packageDatasource,
      code: appsync.Code.fromAsset("./resolvers/package/createPackage.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const updatePackageFunction = new appsync.AppsyncFunction(this, "updatePackageFunction", {
      api,
      name: "updatePackageFunction",
      dataSource: packageDatasource,
      code: appsync.Code.fromAsset("./resolvers/package/updatePackage.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });


    const assignPackageToDeliveryAgentFunction = new appsync.AppsyncFunction(
      this,
      "assignPackageToDeliveryAgentFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "assignPackageToDeliveryAgentFunction",
        code: appsync.Code.fromAsset(
          "./resolvers/package/assignPackageToDeliveryAgent.js"
        ),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const packageTimelapseFunction = new appsync.AppsyncFunction(
      this,
      "packageTimelapseFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "packageTimelapseFunction",
        code: appsync.Code.fromAsset("./resolvers/package/packageTimelapse.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const packageDeliveredFunction = new appsync.AppsyncFunction(
      this,
      "packageDeliveredFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "packageDeliveredFunction",
        code: appsync.Code.fromAsset("./resolvers/package/packageDelivered.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const getPackageFunction = new appsync.AppsyncFunction(
      this,
      "getPackageFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "getPackageFunction",
        code: appsync.Code.fromAsset("./resolvers/package/getPackage.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const getAllPackagesFunction = new appsync.AppsyncFunction(
      this,
      "getAllPackagesFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "getAllPackagesFunction",
        code: appsync.Code.fromAsset("./resolvers/package/getAllPackages.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const getAllPackagesBaseOnStatusFunction = new appsync.AppsyncFunction(
      this,
      "getAllPackagesBaseOnStatusFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "getAllPackagesBaseOnStatusFunction",
        code: appsync.Code.fromAsset("./resolvers/package/getAllPackagesBaseOnStatus.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const getCurrentPackageMovementFunction = new appsync.AppsyncFunction(
      this,
      "getCurrentPackageMovementFunction",
      {
        api,
        dataSource: packageDatasource,
        name: "getCurrentPackageMovementFunction",
        code: appsync.Code.fromAsset("./resolvers/package/getCurrentPackageMovement.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    /********************************************************************************************************
     *      Appsync Mutation resolvers
     */

    new appsync.Resolver(this, "createPackagePipelineResolver", {
      api,
      typeName: "Mutation",
      fieldName: "createPackage",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [createPackageFunction, putEvent],
    });

    new appsync.Resolver(this, "updatePackagePipelineResolver", {
      api,
      typeName: "Mutation",
      fieldName: "updatePackage",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [updatePackageFunction, putEvent],
    });

    new appsync.Resolver(this, "assignPackageToDeliveryPipelineResolver", {
      api,
      typeName: "Mutation",
      fieldName: "assignPackageToDeliveryAgent",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [assignPackageToDeliveryAgentFunction, putEvent],
    });

    new appsync.Resolver(this, "packageTimelapseResolver", {
      api,
      typeName: "Mutation",
      fieldName: "packageTimelapse",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [packageTimelapseFunction],
    });

    new appsync.Resolver(this, "packageDeliveredResolver", {
      api,
      typeName: "Mutation",
      fieldName: "packageDelivered",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [packageDeliveredFunction],
    });

    /********************************************************************************************************
     *      Appsync Query resolvers
     */
    new appsync.Resolver(this, "getPackageResolver", {
      api,
      typeName: "Query",
      fieldName: "getPackage",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [getPackageFunction],
    });


    new appsync.Resolver(this, "getAllPackagesResolver", {
      api,
      typeName: "Query",
      fieldName: "getAllPackages",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [getAllPackagesFunction],
    });

    new appsync.Resolver(this, "getAllPackagesBaseOnStatusResolver", {
      api,
      typeName: "Query",
      fieldName: "getAllPackagesBaseOnStatus",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [getAllPackagesBaseOnStatusFunction],
    });

    new appsync.Resolver(this, "getCurrentPackageMovementResolver", {
      api,
      typeName: "Query",
      fieldName: "getCurrentPackageMovement",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
      pipelineConfig: [getCurrentPackageMovementFunction],
    });

    /********************************************************************************************************
     *      Event bridge rule
     */
    const rule = new events.Rule(this, "package-delivered", {
      eventBus: eventBus,
      eventPattern: {
        detailType: events.Match.exactString("package.delivered"),
        source: ["delivery.api"],
      },
    });

    /********************************************************************************************************
     *      Add GraphQl target to the event bridge rule
     */
    rule.addTarget(new _target.AppSync(api, {
      graphQLOperation: 'mutation packageDelivered($packageId: String!){ packageDelivered(packageId: $packageId) }',
      variables: events.RuleTargetInput.fromObject({
        packageId: events.RuleTargetInput.fromEventPath('$.detailType'),
      }),
    }));

    /********************************************************************************************************
     *      Create IAM Role with the permision to mutate the PackageDelivered Mutatation
     */
    const eventBridgeRole = new iam.Role(this, 'EventBridgeInvokeAppSyncRole', {
      assumedBy: new iam.ServicePrincipal('events.amazonaws.com'), // EventBridge will assume this role
    });

    eventBridgeRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['appsync:GraphQL'],
      resources: [api.arn],
    }));

    api.grantMutation(eventBridgeRole, 'packageDelivered')

    /********************************************************************************************************
     *      Outputs
     */
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