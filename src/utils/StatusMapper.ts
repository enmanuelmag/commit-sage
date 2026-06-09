import { StatusType, Status } from '../type';

export class StatusMapper {
  private static readonly STATUS_MAP = new Map<Status, StatusType>([
    [Status.INDEX_MODIFIED, 'modified'],
    [Status.MODIFIED, 'modified'],
    [Status.INDEX_ADDED, 'added'],
    [Status.ADDED_BY_THEM, 'added'],
    [Status.ADDED_BY_US, 'added'],
    [Status.BOTH_ADDED, 'added'],
    [Status.INTENT_TO_ADD, 'added'],
    [Status.INDEX_DELETED, 'deleted'],
    [Status.DELETED, 'deleted'],
    [Status.DELETED_BY_THEM, 'deleted'],
    [Status.DELETED_BY_US, 'deleted'],
    [Status.BOTH_DELETED, 'deleted'],
    [Status.UNTRACKED, 'untracked'],
  ]);

  static map(status: Status): StatusType {
    return this.STATUS_MAP.get(status) ?? ('other' as const);
  }

  static getStatusMap(): Map<Status, StatusType> {
    return new Map(this.STATUS_MAP);
  }
}
