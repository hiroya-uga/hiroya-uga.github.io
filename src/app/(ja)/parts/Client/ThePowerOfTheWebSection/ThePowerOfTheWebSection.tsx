import clsx from 'clsx';
import styles from './ThePowerOfTheWebSection.module.css';

export const PowerOfTheWebSection = () => {
  return (
    <div className={clsx([styles.root, 'bg-secondary @w640:pb-11 @w640:pt-7 min-h-[400vh] py-8'])}>
      <div className="max-w-content px-content-inline fixed inset-0 mx-auto grid size-full min-h-screen place-items-center">
        <div className={styles.content}>
          <h2 className={styles.heading}>The power of the web</h2>

          <figure>
            <blockquote cite="https://www.w3.org/mission/accessibility/" lang="en" className={styles.message}>
              <p>
                <span className={styles.quote}>“</span>
                <a
                  href="https://www.w3.org/mission/accessibility/#:~:text=The%20power%20of%20the%20Web%20is%20in%20its%20universality.%20Access%20by%20everyone%20regardless%20of%20disability%20is%20an%20essential%20aspect."
                  className={styles.link}
                >
                  The power of the Web is in its universality.{' '}
                  <span className="@w640:inline-block">
                    Access by everyone regardless of disability is an essential aspect.
                  </span>
                </a>
                <span className={styles.quote}>”</span>
              </p>
            </blockquote>
            <figcaption className={styles.caption}>
              <p>
                — <cite>Tim Berners-Lee</cite>, W3C Director and inventor of the World Wide Web
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
};
