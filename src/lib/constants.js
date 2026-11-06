export const ALBUMS = [
  'ISMD Department Day', 'Student Development', 'Freshmen Welcome', 'Academic Activities',
  'Student Projects', 'Team Activities', 'Achievements', 'Graduation Memories', 'Teachers and Students',
]

export const EVENT_TYPES = [
  'Тэнхимийн өдөрлөг', 'Намрын өдөрлөг', 'Оюутны хөгжлийн панел хэлэлцүүлэг',
  'Шинэ элсэгчдийн танилцах өдөрлөг', 'Мэргэжлийн сургалт, семинар', 'Эрдэм шинжилгээний хурал',
  'Программчлалын тэмцээн', 'Дата анализын уралдаан', 'Оюутны клуб, хамтын ажиллагаа',
  'Төгсөгчидтэй хийх уулзалт', 'Мэргэжлийн туршлага солилцох арга хэмжээ',
]

export const PROJECT_TYPES = [
  'Веб сайт', 'Мобайл аппликейшн', 'Мэдээллийн систем', 'Чатбот', 'Автоматжуулалтын систем',
  'Power BI Dashboard', 'Data Mining', 'Machine Learning', 'Өгөгдөлд суурилсан судалгаа', 'Data Visualization',
  'Figma загвар', 'User Interface', 'User Experience',
  'Дипломын ажил', 'Эрдэм шинжилгээний илтгэл', 'Судалгааны тайлан', 'Бие даалтын ажил',
]

export const MAJOR_TOPICS = [
  'Программчлал', 'Программ хангамжийн хөгжүүлэлт', 'Өгөгдлийн сангийн удирдлага', 'Веб хөгжүүлэлт',
  'Мобайл хөгжүүлэлт', 'Мэдээллийн технологийн дэд бүтэц', 'Мэдээллийн системийн удирдлага',
  'Мэдээллийн системийн аудит', 'UI/UX дизайн', 'Өгөгдлийн шинжилгээ', 'Хиймэл оюун ухаан',
]

export const SOURCES = [
  ['СЭЗИС: тэнхимийн хуудас', 'https://ufe.edu.mn/c/76?departmentId=13'],
  ['ISMD Instagram', 'https://www.instagram.com/ufe_ismd/'],
  ['ISMD Facebook', 'https://www.facebook.com/profile.php?id=61576135060864'],
  ['Бүтээлийн сан', 'https://repository.ufe.edu.mn/'],
  ['Онлайн сургалт', 'https://online.ufe.edu.mn/course/index.php?categoryid=20&lang=mn'],
  ['UFE Training', 'https://training.ufe.edu.mn/'],
]

export const today = () => new Date().toISOString().slice(0, 10)
