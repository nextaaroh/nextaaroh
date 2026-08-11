export type ScheduleItem = {
publish_date: string;
day: string;
publish_time: string;
video_type: "Long Video" | "Short Video";
topic: string;
direction: string;
};

export const ANKITA_SCHEDULE: ScheduleItem[] = [
{ publish_date: "13 Aug 2026", day: "Thursday", publish_time: "7:00 PM", video_type: "Long Video", topic: "Introduction + Career Planning", direction: "परिचय, career planning का मतलब, interest/skills कैसे पहचानें, practical examples" },
{ publish_date: "14 Aug 2026", day: "Friday", publish_time: "6:00 PM", video_type: "Short Video", topic: "Career चुनते समय 3 गलतियाँ", direction: "बिना interest career चुनना, दूसरों को देखकर decision लेना, बिना जानकारी course चुनना" },
{ publish_date: "17 Aug 2026", day: "Monday", publish_time: "6:00 PM", video_type: "Short Video", topic: "पढ़ाई के साथ Skill Development क्यों ज़रूरी है?", direction: "Communication, Digital, Problem-solving, Confidence, Practical skills" },
{ publish_date: "19 Aug 2026", day: "Wednesday", publish_time: "7:00 PM", video_type: "Long Video", topic: "Communication Skills कैसे Improve करें?", direction: "hesitation कम करें, active listening, vocabulary, daily practice methods" },
{ publish_date: "20 Aug 2026", day: "Thursday", publish_time: "6:00 PM", video_type: "Short Video", topic: "Confidence बढ़ाने की 3 Tips", direction: "Preparation, speaking clearly, regular practice" },
{ publish_date: "23 Aug 2026", day: "Sunday", publish_time: "7:00 PM", video_type: "Long Video", topic: "Interview की तैयारी कैसे करें?", direction: "introduction, common questions, body-language, calm रहना" },
{ publish_date: "26 Aug 2026", day: "Wednesday", publish_time: "6:00 PM", video_type: "Short Video", topic: "बोलने की Skill Improve करने का आसान तरीका", direction: "रोज़ 5-10 मिनट practice, record करके सुनें, नए शब्द सीखें" },
{ publish_date: "29 Aug 2026", day: "Saturday", publish_time: "7:00 PM", video_type: "Long Video", topic: "Students के लिए Time Management", direction: "priorities, realistic goals, procrastination से बचना" },
];

export const MANDEEP_SCHEDULE: ScheduleItem[] = [
{ publish_date: "15 Aug 2026", day: "Saturday", publish_time: "7:00 PM", video_type: "Long Video", topic: "Sports में Career के Options", direction: "coaching, fitness/training, refereeing, sports management" },
{ publish_date: "16 Aug 2026", day: "Sunday", publish_time: "6:00 PM", video_type: "Short Video", topic: "Sports Career की 3 ज़रूरी बातें", direction: "regular practice, discipline, सही guidance" },
{ publish_date: "18 Aug 2026", day: "Tuesday", publish_time: "6:00 PM", video_type: "Short Video", topic: "Warm-up क्यों ज़रूरी है?", direction: "body को activity के लिए तैयार करना" },
{ publish_date: "21 Aug 2026", day: "Friday", publish_time: "7:00 PM", video_type: "Long Video", topic: "Fitness और Sports Training की Basics", direction: "regular practice, proper guidance, recovery/rest" },
{ publish_date: "22 Aug 2026", day: "Saturday", publish_time: "6:00 PM", video_type: "Short Video", topic: "खेल से पहले Warm-up Tips", direction: "धीरे-धीरे शुरुआत, body तैयार करना" },
{ publish_date: "24 Aug 2026", day: "Monday", publish_time: "6:00 PM", video_type: "Short Video", topic: "Sports में Discipline क्यों ज़रूरी है?", direction: "regular practice, समय की पाबंदी, coach की guidance" },
{ publish_date: "27 Aug 2026", day: "Thursday", publish_time: "7:00 PM", video_type: "Long Video", topic: "Sports में Discipline और Teamwork", direction: "teamwork, communication, एक-दूसरे को support करना" },
{ publish_date: "28 Aug 2026", day: "Friday", publish_time: "6:00 PM", video_type: "Short Video", topic: "Teamwork की छोटी-सी सीख", direction: "हर व्यक्ति की भूमिका महत्वपूर्ण है" },
{ publish_date: "30 Aug 2026", day: "Sunday", publish_time: "6:00 PM", video_type: "Short Video", topic: "Sports में Goal Setting", direction: "realistic goal, छोटे steps, progress check करना" },
{ publish_date: "31 Aug 2026", day: "Monday", publish_time: "7:00 PM", video_type: "Long Video", topic: "Sports Career शुरू करने का सही तरीका", direction: "sport चुनना, regular practice, competitions में participation" },
];

export const VIDEO_GUIDELINES = {
long: ["Duration: 4-10 मिनट", "Strong hook/introduction से शुरुआत करें", "आसान भाषा (Hinglish/Hindi) में समझाएं", "3-5 useful points, practical examples के साथ", "एक clear takeaway के साथ खत्म करें"],
short: ["Duration: 20-40 सेकंड", "पहले 2-3 सेकंड में strong hook", "सिर्फ एक clear idea पर focus", "Explanation concise रखें", "एक memorable takeaway के साथ खत्म करें"],
};
