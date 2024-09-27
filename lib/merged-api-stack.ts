

import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {CfnGraphQLApi} from "aws-cdk-lib/aws-appsync";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {CfnOutput} from "aws-cdk-lib";

const NAME = 'PackageDeliveryMergedApi'
export class MergedApiStack extends cdk.Stack {
  private packageDeliveryMergedApi: CfnGraphQLApi;

  constructor(scope: Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props);

    const executionRole = new Role(this, 'MergedApiExecutionRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com')
    });

    this.packageDeliveryMergedApi = new CfnGraphQLApi(this, `${NAME}`, {
      authenticationType: "API_KEY",
      name: `${NAME}`,
      apiType: 'MERGED',
      mergedApiExecutionRoleArn: executionRole.roleArn,
      additionalAuthenticationProviders: [
        {
          authenticationType: 'AWS_IAM'
        },
      ],
    });

    new CfnOutput(this, `${NAME}Url`, {
      exportName: `${props.stageName}-${NAME}Url`,
      value: this.packageDeliveryMergedApi.attrGraphQlUrl
    });

    new CfnOutput(this, `${NAME}Arn`, {
      exportName: `${props.stageName}-${NAME}Arn`,
      value: this.packageDeliveryMergedApi.attrArn
    })

    new CfnOutput(this, `${NAME}Id`, {
      exportName: `${props.stageName}-${NAME}Id`,
      value: this.packageDeliveryMergedApi.attrApiId
    });

    new CfnOutput(this, `${NAME}ArnExecutionRole`, {
      exportName: `${props.stageName}-${NAME}ExecutionRoleArn`,
      value: executionRole.roleArn
    })
  }
}