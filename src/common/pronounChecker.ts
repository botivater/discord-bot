export default class PronounChecker {
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
    for (const pronoun of PronounChecker.validPronouns) {
      if (string.includes(pronoun)) return true;
    }

    return false;
  }

  public static getPronouns(string = ""): string[] {
    const pronouns = [];

    for (const pronoun of this.validPronouns) {
      if (string.includes(pronoun)) pronouns.push(pronoun);
    }

    return pronouns;
  }
}
