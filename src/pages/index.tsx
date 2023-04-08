import style from '@/styles/Home.module.css';

const Home = () => (
  <div className={style.main}>
    <header>
      <div className={style.headerContents}>
        <button type="button">下書き</button>
        <button type="button">公開</button>
      </div>
    </header>
    <div>エディター等の実装</div>
  </div>
);

export default Home;
