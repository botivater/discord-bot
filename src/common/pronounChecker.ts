export default class PronounChecker {
    protected static validPronouns = ["hij", "hem", "zij", "haar", "hen", "hun", "die", "diens"];
    
    public static checkString(string = ""): boolean {
        for (const pronoun of PronounChecker.validPronouns) {
            if (string.includes(pronoun)) return true;
        }

        return false;
    }
}