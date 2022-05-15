export default class PronounChecker {
    protected static pronounRegex =
        /([A-z]+(?:\/[A-z]+)+)/g;

    protected static validPronouns = [
        "unknown",
        "hij",
        "hem",
        "zij",
        "haar",
        "hen",
        "hun",
        "die",
        "diens",
    ];

    public static checkString(string = ""): boolean {
        const pronouns = PronounChecker.getPronouns(string);
        
        for (const pronoun of pronouns) {
            if (!this.validPronouns.find(validPronoun => validPronoun === pronoun)) return false;
        }

        return true;
    }

    public static getPronouns(string = ""): string[] {
        const pronounsMatch = string.match(this.pronounRegex) || [];
        
        if (pronounsMatch.length > 0) {
            return pronounsMatch[0].split("/");
        }

        return [];
    }
}
