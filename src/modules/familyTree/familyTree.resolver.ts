import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Context } from '@nestjs/graphql';
import { FamilyTree } from './familyTree.entity';
import { FamilyTreeService } from './familyTree.service';
import { RequestWithUser } from 'src/shared/types';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Resolver(of => FamilyTree)
@UseGuards(AuthGuard)
export class FamilyTreeResolver {
  constructor(private readonly familyTreeService: FamilyTreeService) {}

  @Query(returns => FamilyTree)
  public async familyTree(
    @Context('req') { user }: RequestWithUser,
    @Args('id') id: string,
  ) {
    return this.familyTreeService.findOne({ id });
  }
}
