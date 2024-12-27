import OpenAI from "openai";

export class Summariser {
    /**
     * Creates an instance of the Summariser class.
     * Initializes the OpenAI client and sets the instructions for summarizing data.
     */
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
      Make sure to think about the best way to present the data in a sentence and make it interesting and insightful.
      `;
    }

    /**
     * Generates a chat completion based on the provided message and optional data.
     * @param {string} message - The message to send to the OpenAI chat completion API.
     * @param {Object} [data=null] - Optional data to include in the chat completion request.
     * @returns {Promise<string>} - The content of the chat completion response.
     */
    async chat(message, data = null) {
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{"role": "user", "content": message}, {"role": "user", "content": JSON.stringify(data)}]
        });

        return completion.choices[0].message.content;
    }

    /**
     * Summarizes the provided data using the OpenAI chat completion API.
     * @param {Object} data - The data to summarize.
     * @returns {Promise<string>} - The content of the summarization response.
     */
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
