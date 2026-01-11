import { Injectable } from '@nestjs/common';

/**
 * FUTURE SERVICE
 * Not wired into controllers yet.
 */
@Injectable()
export class AccessDelegationService {
  grantAccess() {}
  revokeAccess() {}
  checkAccess() {}
}
