import { Word, Level } from './types';

export const WORDS: Word[] = [
  // Unit 1: Greetings & School
  {
    id: 'w1',
    text: 'hello',
    chinese: '你好',
    phonics: ['hel', 'lo'],
    category: '问候',
    examples: [{ en: 'Hello, how are you?', zh: '你好，你好吗？' }]
  },
  {
    id: 'w2',
    text: 'name',
    chinese: '名字',
    phonics: ['n', 'ame'],
    category: '学校',
    examples: [{ en: 'My name is Zoom.', zh: '我的名字叫礼品。' }]
  },
  {
    id: 'w12',
    text: 'pencil',
    chinese: '铅笔',
    phonics: ['pen', 'cil'],
    category: '学校',
    examples: [{ en: 'Show me your pencil.', zh: '给我看看你的铅笔。' }]
  },
  // Unit 2: Colors
  {
    id: 'w3',
    text: 'red',
    chinese: '红色',
    phonics: ['r', 'e', 'd'],
    category: '颜色',
    examples: [{ en: 'The apple is red.', zh: '苹果是红色的。' }]
  },
  {
    id: 'w4',
    text: 'yellow',
    chinese: '黄色',
    phonics: ['yel', 'low'],
    category: '颜色',
    examples: [{ en: 'The banana is yellow.', zh: '香蕉是黄色的。' }]
  },
  {
    id: 'w5',
    text: 'blue',
    chinese: '蓝色',
    phonics: ['bl', 'ue'],
    category: '颜色',
    examples: [{ en: 'The sky is blue.', zh: '天空是蓝色的。' }]
  },
  // Unit 3: Body
  {
    id: 'w9',
    text: 'eye',
    chinese: '眼睛',
    phonics: ['e', 'ye'],
    category: '身体',
    examples: [{ en: 'Close your eyes.', zh: '闭上你的眼睛。' }]
  },
  {
    id: 'w10',
    text: 'nose',
    chinese: '鼻子',
    phonics: ['n', 'o', 'se'],
    category: '身体',
    examples: [{ en: 'Touch your nose.', zh: '摸摸你的鼻子。' }]
  },
  // Unit 4: Animals
  {
    id: 'w6',
    text: 'cat',
    chinese: '猫',
    phonics: ['c', 'a', 't'],
    category: '动物',
    examples: [{ en: 'I have a small cat.', zh: '我有一只小猫。' }]
  },
  {
    id: 'w7',
    text: 'dog',
    chinese: '狗',
    phonics: ['d', 'o', 'g'],
    category: '动物',
    examples: [{ en: 'The dog is big.', zh: '这只狗很大。' }]
  },
  {
    id: 'w20',
    text: 'panda',
    chinese: '熊猫',
    phonics: ['pan', 'da'],
    category: '动物',
    examples: [{ en: 'I like pandas.', zh: '我喜欢大熊猫。' }]
  },
  // Unit 5: Numbers
  {
    id: 'w15',
    text: 'three',
    chinese: '三',
    phonics: ['th', 'r', 'ee'],
    category: '数字',
    examples: [{ en: 'I am three years old.', zh: '我三岁了。' }]
  },
  {
    id: 'w21',
    text: 'eight',
    chinese: '八',
    phonics: ['eigh', 't'],
    category: '数字',
    examples: [{ en: 'I have eight pencils.', zh: '我有八支铅笔。' }]
  }
];

export const LEVELS: Level[] = [
  {
    id: 'l1',
    title: 'Unit 1：你好校园',
    words: ['w1', 'w2', 'w12'],
    unlocked: true,
    completed: false,
    starCount: 0
  },
  {
    id: 'l2',
    title: 'Unit 2：五彩世界',
    words: ['w3', 'w4', 'w5'],
    unlocked: false,
    completed: false,
    starCount: 0
  },
  {
    id: 'l3',
    title: 'Unit 3：认识自我',
    words: ['w9', 'w10'],
    unlocked: false,
    completed: false,
    starCount: 0
  },
  {
    id: 'l4',
    title: 'Unit 4：动物朋友',
    words: ['w6', 'w7', 'w20'],
    unlocked: false,
    completed: false,
    starCount: 0
  },
  {
    id: 'l5',
    title: 'Unit 5：趣味数字',
    words: ['w15', 'w21'],
    unlocked: false,
    completed: false,
    starCount: 0
  }
];
