const MODERATION_KEY = process.env.MODERATION_KEY

// check the content for bad words
export default async function checkModeration(content: string) {
    try {
        const response = fetch(`https://api1.webpurify.com/services/rest/?method=webpurify.live.check&api_key=${MODERATION_KEY}&text=${content}&format=json`)

        const data = await (await response).json();
        return data.rsp.found !== "0";  //bad word found

    } catch (e) {
        console.log(e);
        return false;
    }
}