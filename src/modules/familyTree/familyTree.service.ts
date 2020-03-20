import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fs from 'fs';
import parseGedcom from 'parse-gedcom';

import { BaseService } from '../../base.service';
import { BackendLogger } from '../logger/BackendLogger';
import { FamilyTree } from './familyTree.entity';
import { ITreeNode } from './interfaces/ITreeNode';
import {
  INDIVIDUAL_TAG,
  HEAD_TAG,
  SUBMITTER_TAG,
  FAMILY_TAG,
  NAME_TAG,
  SEX_TAG,
  REFERENCE_TAG,
  ALIAS_TAG,
  BIRTH_TAG,
  DATE_TAG,
  PLACE_TAG,
  DEATH_TAG,
  NOTE_TAG,
  FAMILY_SPOUSE_TAG,
  OCCUPATION_TAG,
  BURIAL_TAG,
  FAMILY_CHILD_TAG,
  CAUSE_TAG,
  EVENT_TAG,
  TYPE_TAG,
  SOURCE_TAG,
  CONCATENATION_TAG,
  ADDRESS_TAG,
  PHONE_TAG,
  EMAIL_TAG,
} from './nodeTags';

@Injectable()
export class FamilyTreeService extends BaseService<FamilyTree> {
  private readonly logger = new BackendLogger(FamilyTreeService.name);

  constructor(
    @InjectRepository(FamilyTree)
    private readonly familyTreeRepo: Repository<FamilyTree>,
  ) {
    super(familyTreeRepo);
  }

  public async importNewFamilyTree(gedcomFile: any) {
    console.log('file:', gedcomFile);
    const data = fs.readFileSync(gedcomFile.path, 'utf-8');

    const gedcom = parseGedcom.parse(data);
    await this.parseTree(gedcom);

    return { success: true };
  }

  private parseTree(tree: ITreeNode[]) {
    for (const node of tree) {
      if (node.tag === HEAD_TAG) {
        // no op
      } else if (node.tag === SUBMITTER_TAG) {
        // no op
      } else if (node.tag === FAMILY_TAG) {
        // no op
      } else if (node.tag === INDIVIDUAL_TAG) {
        const individualData = this.parseIndividualNode(node);
      } else {
        throw new Error(`Unknown tag when parsing tree: ${node.tag}`);
      }
    }
  }

  /**
   * Gets the info from an individual's node that makes up the info for that person
   *
   * @param individualNode Node to parse
   */
  private parseIndividualNode(individualNode: ITreeNode) {
    const individualData: any = {};

    for (const node of individualNode.tree) {
      if (node.tag === NAME_TAG) {
        individualData.name = node.data;
      } else if (node.tag === SEX_TAG) {
        individualData.sex = node.data;
      } else if (node.tag === REFERENCE_TAG) {
        individualData.reference = node.data;
      } else if (node.tag === ALIAS_TAG) {
        individualData.alias = node.data;
      } else if (node.tag === BIRTH_TAG || node.tag === DEATH_TAG) {
        individualData.birth = this.parseDatePlace(node);
      } else if (node.tag === NOTE_TAG) {
        individualData.noteRef = this.parseConcatNode(node);
      } else if (node.tag === FAMILY_SPOUSE_TAG) {
        individualData.familySpouseRef = node.data;
      } else if (node.tag === OCCUPATION_TAG) {
        individualData.occupation = this.parseOccupationNode(node);
      } else if (node.tag === BURIAL_TAG) {
        individualData.burial = this.parseDatePlace(node);
      } else if (node.tag === FAMILY_CHILD_TAG) {
        individualData.familyChildRef = node.data;
      } else if (node.tag === EVENT_TAG) {
        individualData.event = this.parseEventNode(node);
      } else if (node.tag === ADDRESS_TAG) {
        individualData.address = this.parseDatePlace(node);
      } else if (node.tag === PHONE_TAG) {
        individualData.phone = this.parseDatePlace(node);
      } else if (node.tag === EMAIL_TAG) {
        individualData.email = this.parseDatePlace(node);
      } else {
        throw new Error(
          `Unknown tag when parsing individual: ${node.tag}\n${JSON.stringify(
            node,
            null,
            4,
          )}`,
        );
      }
    }

    return individualData;
  }

  private parseDatePlace(birthNode: ITreeNode) {
    const datePlaceData: any = {};

    for (const node of birthNode.tree) {
      if (node.tag === DATE_TAG) {
        datePlaceData.date = node.data;
      } else if (node.tag === PLACE_TAG) {
        datePlaceData.place = node.data;
      } else if (node.tag === CAUSE_TAG) {
        datePlaceData.cause = node.data;
      } else if (node.tag === SOURCE_TAG) {
        datePlaceData.source = this.parseSourceNode(node);
      } else {
        throw new Error(
          `Unknown tag when parsing date/place: ${node.tag}\n${JSON.stringify(
            node,
          )}`,
        );
      }
    }

    return datePlaceData;
  }

  private parseOccupationNode(occupationNode: ITreeNode) {
    const occupationData: any = {};

    for (const node of occupationNode.tree) {
      if (node.tag === PLACE_TAG) {
        occupationData.place = node.data;
      } else if (node.tag === DATE_TAG) {
        occupationData.date = node.data;
      } else {
        throw new Error(
          `Unknown tag when parsing occupation: ${node.tag}: ${JSON.stringify(
            node,
          )}`,
        );
      }
    }

    return occupationData;
  }

  private parseEventNode(eventNode: ITreeNode) {
    const eventData: any = {};

    for (const node of eventNode.tree) {
      if (node.tag === TYPE_TAG) {
        eventData.type = node.data;
      } else if (node.tag === PLACE_TAG) {
        eventData.place = node.data;
      } else if (node.tag === SOURCE_TAG) {
        eventData.source = this.parseSourceNode(node);
      } else {
        throw new Error(
          `Unknown tag when parsing event: ${node.tag}\n${JSON.stringify(
            node,
            null,
            4,
          )}`,
        );
      }
    }

    return eventData;
  }

  private parseSourceNode(sourceNode: ITreeNode) {
    const sourceData: any = { sourceName: sourceNode.data };

    for (const node of sourceNode.tree) {
      if (node.tag === CONCATENATION_TAG) {
        sourceData.sourceName += node.data;
      } else if (node.tag === NOTE_TAG) {
        sourceData.note = this.parseConcatNode(node);
      } else {
        throw new Error(
          `Unknown tag when parsing source: ${node.tag}\n${JSON.stringify(
            node,
            null,
            4,
          )}`,
        );
      }
    }

    return sourceData;
  }

  private parseConcatNode(n: ITreeNode) {
    let value = n.data;
    for (const node of n.tree) {
      if (node.tag === CONCATENATION_TAG) {
        value += node.data;
      } else {
        throw new Error(`Unknown tag when parsing concat node:  ${node.tag}`);
      }
    }

    return value;
  }
}
