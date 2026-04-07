import { Injectable } from '@nestjs/common';
import {
  InjectOpensearchClient,
  OpensearchClient,
} from 'nestjs-opensearch';

@Injectable()
export class OpensearchService {
  constructor(
    @InjectOpensearchClient()
    private readonly opensearchClient: OpensearchClient,
  ) {}

  async getInfo() {
    return this.opensearchClient.info();
  }

  async getHealth() {
    return this.opensearchClient.cluster.health();
  }
}
