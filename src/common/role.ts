import Config from "./config";

export default class Role {
    public static OWNER = Config.getOwnerRoleId();
    public static MODERATOR = Config.getModeratorRoleId();
    public static DEVELOPER = Config.getDeveloperRoleId();
}
