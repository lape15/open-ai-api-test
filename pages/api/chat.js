import { Configuration, OpenAIApi } from "openai";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import { db } from "./auth/firebase";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getUserChats = async (uid) => {
  const chats = [];
  try {
    const q = query(collection(db, "chats"), where("user", "==", uid));
    const docs = await getDocs(q);
    let localDocs = {};
    docs.forEach((doc) => {
      localDocs = doc.data();
      console.log("test");
      localDocs.id = doc.id;
      chats.push(localDocs);
    });
    return chats;
  } catch (err) {
    console.log("ERR", { err });
    return "Error fetching docs";
  }
};

const setChatsobjecIntoCollections = async (chat) => {
  try {
    const q = await addDoc(collection(db, "chats"), {
      user: chat.id,
      timeSent: Date.now(),
      userChat: chat.text,
      response: chat.response,
      timeReceived: chat.timeReceived,
    });
  } catch (err) {
    console.log(err);
  }
};

const callOut = async (word, userId, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      messages: [{ role: "user", content: word }],
    });
    const chat = {
      id: userId,
      text: word,
      response: completion.data.choices[0].message.content,
      timeReceived: completion.data.created,
    };
    const dbUpload = await setChatsobjecIntoCollections(chat);
    return { result: completion.data.choices[0].message.content };
  } catch (error) {
    console.log(error, "ERRROR");
  }
};

export default callOut;
