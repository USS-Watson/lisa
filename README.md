# LISA - a Local Intelligent School Advisor
We built this project in 24 hours at [Hack Midwest](https://hackmidwest.com) 2024, and it received 2nd place for the Red Hat & Intel OpenShift AI Challenge. See below for a description of what LISA does. We deployed the app on the OpenShift platform during the competition, and the code in this repo is completely open-source. We aren't able to provide LISA's face model though since we modeled it after a real person at the hackathon (and it turned out somewhat creepy lol). If you are interested in taking this project further or spinning up your own instance of LISA, feel free to reach out to us and we can help out!

## DEMO



https://github.com/user-attachments/assets/7e7c6c38-6246-4130-8e4a-e65a8baa246d



## DESCRIPTION

We built LISA, an AI assistant whose name stands for "Local Intelligent School Advisor". She's an AI college advisor, and she's not just a chatbot: she has a voice and a face, and you talk to her over a video call! Using Red Hat's OpenShift AI platform, user speech is transcribed into text and fed into a large language model that utilizes Intel AMX hardware acceleration. The response is then converted back into audio and spoken in an animation by LISA herself. Her language model is trained on the courses provided at your university, giving you immediate responses and information about what courses you need to take. Conveniently, the OpenShift platform provided all the AI components we needed to take a user’s speech audio, convert it to text, and prompt a custom LLM for LISA’s response.

As an open-source enterprise solution, we believe LISA has quite a lot of potential. In the future, we envision universities using software similar to LISA as an alternative to human academic advisors. LISA provides 24/7 access to academic advising, which is perfect for students who [used to wait days to weeks](https://thedailycougar.com/2020/12/28/students-discouraged-by-academic-advising-wait-times/) for human advisors. With the potential of [retrieval-augmented generation](https://www.redhat.com/en/topics/ai/what-is-retrieval-augmented-generation) (RAG) and other advancements in LLMs, a language model can be trained on all the knowledge required to make academic advising decisions. From there, students can prompt that model and receive accurate advising on their graduation requirements. In our 24-hour prototype implementation, without RAG and using webscraping instead of proper university integration, LISA was still able to (somewhat) accurately tell us which classes to take depending on our year. As this technology improves, so will her capabilities. Our team had a blast at Hack Midwest, thanks to everyone at Red Hat for the fun challenge!

## OUR TEAM

1. [Alex Schwarz](https://curtain.sh) || [curtainman](https://github.com/curtainman)
2. [Anton Angeletti](https://antonangeletti.com) || [anton-3](https://github.com/anton-3)
3. [Blaine Traudt](https://traudt.dev) || [blaine-t](https://github.com/blaine-t)
4. [Louis Quattrocchi](https://waltlab.com) || [WalterOfNone](https://github.com/WalterOfNone)
