#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkPackageServiceStack } from "../lib/cdk-package-service-stack";

const app = new cdk.App();
new CdkPackageServiceStack(app, "CdkPackageServiceStack");
