import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type MachineCard = {
  title: string;
  image: string;
  description: string;
  link: string;
};

const machines: MachineCard[] = [
  {
    title: 'LowRider CNC',
    image: '/img/lowrider/v4/LowRider4_Main.png',
    description:
      'A full-sheet capable CNC router. Cuts wood, aluminum, and more with a large work area at a fraction of the cost of commercial machines.',
    link: '/lowrider/intro',
  },
  {
    title: 'MPCNC',
    image: '/img/old/2020/06/Primo-scaled.jpg',
    description:
      'The Mostly Printed CNC. A customizable CNC platform that can mill, laser, drag knife, and plot. Built with common hardware and 3D printed parts.',
    link: '/mpcnc/intro',
  },
  {
    title: 'MP3DP',
    image: '/img/mp3dpv5/printer.jpeg',
    description:
      'The Milled/Printed 3D Printer. A CoreXY printer with CNC-milled plates for rigidity and 3D printed parts where it counts.',
    link: '/mp3dp/intro',
  },
  {
    title: 'ZenXY',
    image: '/img/old/2021/03/XZXY-V2F-squarer.jpg',
    description:
      'An automated sand table inspired by Sisyphus Tables. Uses a CoreXY belting system to draw mesmerizing patterns in sand or baking soda.',
    link: '/zenxy/intro',
  },
];

function MachineCardComponent({title, image, description, link}: MachineCard) {
  const imgUrl = useBaseUrl(image);
  return (
    <div className={clsx('col col--4')}>
      <Link to={link} className={styles.cardLink}>
        <div className={styles.card}>
          <div className={styles.cardImage}>
            <img src={imgUrl} alt={title} />
          </div>
          <div className={styles.cardBody}>
            <Heading as="h3">{title}</Heading>
            <p>{description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const logoUrl = useBaseUrl('/img/v1-logo.png');
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <img
          src={logoUrl}
          alt="V1 Engineering"
          className={styles.heroLogo}
        />
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="V1 Engineering - Open source CNC and 3D Printer builds">
      <HomepageHeader />
      <main className={styles.main}>
        <section className={styles.machines}>
          <div className="container">
            <div className="row">
              {machines.map((machine) => (
                <MachineCardComponent key={machine.title} {...machine} />
              ))}
            </div>
          </div>
        </section>
        <section className={styles.community}>
          <div className="container">
            <Heading as="h2">Join the Community</Heading>
            <p>
              Have questions or want to share your build? Join thousands of makers on the V1 Engineering forums.
            </p>
            <Link
              className="button button--primary button--lg"
              to="https://forum.v1e.com">
              Visit the Forums
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
