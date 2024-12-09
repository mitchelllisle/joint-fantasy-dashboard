import OpenAI from "openai";

export class Summariser {
    constructor() {
        this.openai = new OpenAI();
        this.instructions = `You are going to help me analyse some fantasy premier league data for the competition I'm in and write a short sentence about it. 
      When commenting on the results, try to avoid simple descriptions and focus more on finding something interesting. 
      Also, make sure to mention something about each user (Ryan, Mitchell, Jay and Kerrod).
      There are 38 gameweeks but you'll get the gameweeks that have been completed. 
      Comment on the overall possibility of someone being able to win the league or slip into last place.
      It has to sit at the top of a dashbord so make it concise and to the point.
      points_acc is the cumulative points for each team and will tell you the standings in the league, but you have to also make sure you're looking at the latest gameweek (higher number).
      Also, the loser has to pay $500 to the teams joint bank account so make sure to mention that in the sentence if it's relevant.
      `;
    }

    async summarise(data) {
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {"role": "system", "content": this.instructions},
                {"role": "user", "content": JSON.stringify(data)}
            ]
        });

        return completion.choices[0].message.content;
    }
}
