import { Word, Level } from './types';

export const WORDS: Word[] = [
  // Greetings
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
    text: 'goodbye',
    chinese: '再见',
    phonics: ['good', 'bye'],
    category: '问候',
    examples: [{ en: 'Goodbye, teacher.', zh: '老师再见。' }]
  },
  // Colors
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
  // Animals
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
    id: 'w8',
    text: 'rabbit',
    chinese: '兔子',
    phonics: ['rab', 'bit'],
    category: '动物',
    examples: [{ en: 'Rabbits love carrots.', zh: '兔子喜欢胡萝卜。' }]
  },
  // Body
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
  {
    id: 'w11',
    text: 'mouth',
    chinese: '嘴巴',
    phonics: ['m', 'ou', 'th'],
    category: '身体',
    examples: [{ en: 'Open your mouth.', zh: '张开你的嘴巴。' }]
  },
  // Numbers
  {
    id: 'w15',
    text: 'one',
    chinese: '一',
    phonics: ['o', 'ne'],
    category: '数字',
    examples: [{ en: 'I have one apple.', zh: '我有一个苹果。' }]
  },
  {
    id: 'w16',
    text: 'ten',
    chinese: '十',
    phonics: ['t', 'e', 'n'],
    category: '数字',
    examples: [{ en: 'I count to ten.', zh: '我数到十。' }]
  },
  // Family
  {
    id: 'w17',
    text: 'father',
    chinese: '爸爸',
    phonics: ['fa', 'ther'],
    category: '家庭',
    examples: [{ en: 'This is my father.', zh: '这是我的爸爸。' }]
  },
  {
    id: 'w18',
    text: 'mother',
    chinese: '妈妈',
    phonics: ['moth', 'er'],
    category: '家庭',
    examples: [{ en: 'I love my mother.', zh: '我爱我的妈妈。' }]
  },
  {
    id: 'w19',
    text: 'brother',
    chinese: '兄弟',
    phonics: ['bro', 'ther'],
    category: '家庭',
    examples: [{ en: 'He is my big brother.', zh: '他是我的大哥哥。' }]
  }
];

export const LEVELS: Level[] = [
  {
    id: 'l1',
    title: '第一关：见面打招呼',
    words: ['w1', 'w2'],
    unlocked: true,
    completed: false,
    starCount: 0
  },
  {
    id: 'l2',
    title: '第二关：缤纷色彩',
    words: ['w3', 'w4', 'w5'],
    unlocked: false,
    completed: false,
    starCount: 0
  },
  {
    id: 'l3',
    title: '第三关：可爱的动物',
    words: ['w6', 'w7', 'w8'],
    unlocked: false,
    completed: false,
    starCount: 0
  },
  {
    id: 'l4',
    title: '第四关：认识我的身体',
    words: ['w9', 'w10', 'w11'],
    unlocked: false,
    completed: false,
    starCount: 0
  },
  {
    id: 'l5',
    title: '第五关：我的文具盒',
    words: ['w12', 'w13', 'w14'],
    unlocked: false,
    completed: false,
    starCount: 0
  },
  {
    id: 'l6',
    title: '第六关：快乐数一数',
    words: ['w15', 'w16'],
    unlocked: false,
    completed: false,
    starCount: 0
  },
  {
    id: 'l7',
    title: '第七关：我的一家人',
    words: ['w17', 'w18', 'w19'],
    unlocked: false,
    completed: false,
    starCount: 0
  }
];
