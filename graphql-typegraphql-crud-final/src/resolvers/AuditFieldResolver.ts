import { Resolver, FieldResolver, Root } from "type-graphql";
import { Audit } from "../schema/Audit";
import { Changes } from "../schema/Changes";

@Resolver(() => Audit)
export class AuditFieldResolver {
  @FieldResolver(() => [Changes], { nullable: true })
  changes(@Root() audit: Audit): Changes[] {
    if (!audit.changes) return [];
    if (typeof audit.changes === "string") {
      try {
        return JSON.parse(audit.changes);
      } catch {
        return [];
      }
    }
    if (Array.isArray(audit.changes)) return audit.changes;
    return [];
  }
} 