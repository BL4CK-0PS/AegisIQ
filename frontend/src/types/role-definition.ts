export interface RoleDefinition {
  role_definition_id: string;
  filename: string;
  status: "uploaded" | "parsing" | "parsed" | "failed";
}
