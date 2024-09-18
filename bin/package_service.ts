#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PackageServiceStack } from '../lib/package_service-stack';

const app = new cdk.App();
new PackageServiceStack(app, 'PackageServiceStack', {});