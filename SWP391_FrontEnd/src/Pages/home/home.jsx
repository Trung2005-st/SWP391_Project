import React from "react";
import "./globalCSS/style.css";
import "./globalCSS/globals.css";
import "./globalCSS/styleguide.css";
import { ROUTES } from "../../configs/routes";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className="desktop">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="rectangle"></div>
          <header className="header">
            <div className="logo">
              <div className="logo-img">
                <img
                  className="element"
                  src="/image/Lung.png"
                  alt="Lung logo"
                />
              </div>
              <div className="text-wrapper">QuitHub</div>
            </div>
            <div className="frame">
              <div className="navbar">
                <div className="div">Home</div>
                <div className="text-wrapper-2">
                  <NavLink
                    to={ROUTES.ADMIN_USER}
                    className={({ isActive }) =>
                      isActive ? "nav-active" : "nav-inactive"
                    }
                  >
                    Leaderboard
                  </NavLink>
                </div>
                <div className="text-wrapper-3">
                  <NavLink
                    to={ROUTES.ADMIN_MEMBERSHIP}
                    className={({ isActive }) =>
                      isActive ? "nav-active" : "nav-inactive"
                    }
                  >
                    Progress
                  </NavLink>
                </div>
                <div className="text-wrapper-4">
                  <NavLink
                    to={ROUTES.ADMIN_QUIT}
                    className={({ isActive }) =>
                      isActive ? "nav-active" : "nav-inactive"
                    }
                  >
                    Community
                  </NavLink>
                </div>
              </div>
              <NavLink
                to={ROUTES.LOGIN}
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-inactive"
                }
              >
                <button className="start-btn">
                  <div className="text-wrapper-5">Get Started</div>
                </button>
              </NavLink>
            </div>
          </header>
          <div className="hero-section">
            <div className="frame-2">
              <div className="text-block">
                <div className="text-wrapper-6">Break Free from Smoking</div>
                <p className="p">
                  Join thousands who have successfully quit smoking with our
                  comprehensive support platform. Track your progress, connect
                  with others, and celebrate every milestone on your journey to
                  a healthier life.
                </p>
              </div>
              <div className="btn">
                <div className="div-wrapper">
                  <div className="text-wrapper-7">Start Your Journey</div>
                </div>
                <button className="more-btn">
                  <div className="text-wrapper-8">Learn More</div>
                </button>
              </div>
              <div className="achive">
                <div className="frame-3">
                  <div className="text-wrapper-9">2,847</div>
                  <div className="text-wrapper-10">Success Stories</div>
                </div>
                <div className="frame-3">
                  <div className="text-wrapper-9">$2.1M</div>
                  <div className="text-wrapper-10">Money Saved</div>
                </div>
                <div className="frame-3">
                  <div className="text-wrapper-9">156</div>
                  <div className="text-wrapper-10">Days Average</div>
                </div>
              </div>
            </div>
          </div>
          <div className="body">
            <div className="text-wrapper-11">Why Choose QuitHub?</div>
            <p className="text-wrapper-12">
              Our platform combines proven cessation methods with modern
              technology to give you the best chance of success.
            </p>
            <div className="div-2">
              <div className="content-container">
                <img
                  className="img"
                  src="/image/quit.png"
                  alt="Quit tracking"
                />
                <div className="text-wrapper-13">Quit Tracking</div>
                <p className="text-wrapper-14">
                  Monitor your smoke-free journey with detailed progress
                  tracking and milestone celebrations.
                </p>
              </div>
              <div className="content-container-2">
                <img
                  className="img"
                  src="/image/health.png"
                  alt="Health recovery"
                />
                <div className="text-wrapper-15">Health Recovery</div>
                <p className="text-wrapper-14">
                  Watch your body heal with real-time health improvement
                  indicators and recovery timelines.
                </p>
              </div>
              <div className="content-container-3">
                <img
                  className="img"
                  src="/image/trophy.png"
                  alt="Achievement system"
                />
                <div className="text-wrapper-16">Achievement System</div>
                <p className="text-wrapper-17">
                  Earn badges and rewards for reaching important milestones in
                  your cessation journey.
                </p>
              </div>
              <div className="content-container-4">
                <img
                  className="img"
                  src="/image/people.png"
                  alt="Community support"
                />
                <div className="text-wrapper-18">Community Support</div>
                <p className="text-wrapper-19">
                  Connect with others on the same journey for motivation, tips,
                  and encouragement.
                </p>
              </div>
            </div>
          </div>
          <div className="body-2">
            <div className="text-block-2">
              <div className="text-wrapper-20">Community Stories</div>
              <p className="text-wrapper-21">
                Read inspiring stories and helpful tips from our community
                members who are winning their battle against smoking.
              </p>
            </div>
            <div className="div-2">
              <div className="post">
                <div className="overlap-group">
                  <div className="IMG-wrapper">
                    <img
                      className="IMG"
                      src="/image/IMG.png"
                      alt="Rachel's story"
                    />
                  </div>
                  <div className="frame-4">
                    <div className="btn-category">
                      <div className="text-wrapper-22">Success Story</div>
                    </div>
                    <div className="btn-streak">
                      <div className="text-wrapper-23">🔥</div>
                      <div className="text-wrapper-24">156 days</div>
                    </div>
                  </div>
                  <div className="frame-5">
                    <img
                      className="avt"
                      src="/image/avt.png"
                      alt="Rachel Thompson"
                    />
                    <div className="frame-6">
                      <div className="text-wrapper-25">Rachel Thompson</div>
                      <div className="text-wrapper-26">2 hours ago</div>
                    </div>
                  </div>
                  <div className="text-block-3">
                    <p className="text-wrapper-27">
                      My 100-Day Journey: From Chain Smoker to Marathon Runner
                    </p>
                    <p className="text-wrapper-28">
                      I never thought I could run a mile, let alone 26.2. Here's
                      how quitting smoking transformed my entire life and led me
                      to complete my first marathon...
                    </p>
                  </div>
                  <div className="rectangle-2"></div>
                  <div className="frame-7">
                    <div className="div-3">
                      <div className="like">
                        <img
                          className="img-2"
                          src="/image/icon-heart.png"
                          alt="Likes"
                        />
                        <div className="text-wrapper-29">47</div>
                      </div>
                      <div className="div-3">
                        <img
                          className="img-2"
                          src="/image/icon-comment.png"
                          alt="Comments"
                        />
                        <div className="text-wrapper-30">12</div>
                      </div>
                    </div>
                    <div className="text-wrapper-31">Read More</div>
                  </div>
                </div>
              </div>
              <div className="post">
                <div className="overlap-group">
                  <div className="IMG-wrapper">
                    <img
                      className="IMG"
                      src="/image/IMG2.png"
                      alt="Marcus's story"
                    />
                  </div>
                  <div className="frame-4">
                    <div className="btn-category">
                      <div className="text-wrapper-22">Education</div>
                    </div>
                    <div className="btn-streak">
                      <div className="text-wrapper-23">🔥</div>
                      <div className="text-wrapper-24">89 days</div>
                    </div>
                  </div>
                  <div className="frame-5">
                    <img
                      className="avt"
                      src="/image/avt2.png"
                      alt="Marcus Williams"
                    />
                    <div className="frame-6">
                      <div className="text-wrapper-25">Marcus Williams</div>
                      <div className="text-wrapper-26">5 hours ago</div>
                    </div>
                  </div>
                  <div className="text-block-3">
                    <p className="text-wrapper-27">
                      The Science Behind Cravings: What I Learned in My First
                      Month
                    </p>
                    <p className="text-wrapper-28">
                      Understanding the neuroscience of nicotine addiction
                      helped me develop better coping strategies. Here are the
                      key insights that kept me smoke-free...
                    </p>
                  </div>
                  <div className="rectangle-2"></div>
                  <div className="frame-7">
                    <div className="div-3">
                      <div className="like">
                        <img
                          className="img-2"
                          src="/image/icon-heart.png"
                          alt="Likes"
                        />
                        <div className="text-wrapper-29">32</div>
                      </div>
                      <div className="div-3">
                        <img
                          className="img-2"
                          src="/image/icon-comment.png"
                          alt="Comments"
                        />
                        <div className="text-wrapper-30">8</div>
                      </div>
                    </div>
                    <div className="text-wrapper-31">Read More</div>
                  </div>
                </div>
              </div>
              <div className="post">
                <div className="overlap-group">
                  <div className="IMG-wrapper">
                    <img
                      className="IMG"
                      src="/image/IMG3.png"
                      alt="Sofia's story"
                    />
                  </div>
                  <div className="frame-4">
                    <div className="btn-category">
                      <div className="text-wrapper-22">Tips & Tricks</div>
                    </div>
                    <div className="btn-streak">
                      <div className="text-wrapper-23">🔥</div>
                      <div className="text-wrapper-24">234 days</div>
                    </div>
                  </div>
                  <div className="frame-5">
                    <img
                      className="avt"
                      src="/image/avt3.png"
                      alt="Sofia Rodriguez"
                    />
                    <div className="frame-6">
                      <div className="text-wrapper-25">Sofia Rodriguez</div>
                      <div className="text-wrapper-26">1 day ago</div>
                    </div>
                  </div>
                  <div className="text-block-3">
                    <p className="text-wrapper-27">
                      Dealing with Social Situations: My Party Survival Guide
                    </p>
                    <p className="text-wrapper-28">
                      Going to bars and parties was my biggest challenge. I
                      developed a foolproof strategy that helped me stay strong
                      in tempting social situations...
                    </p>
                  </div>
                  <div className="rectangle-2"></div>
                  <div className="frame-7">
                    <div className="div-3">
                      <div className="like">
                        <img
                          className="img-2"
                          src="/image/icon-heart.png"
                          alt="Likes"
                        />
                        <div className="text-wrapper-29">68</div>
                      </div>
                      <div className="div-3">
                        <img
                          className="img-2"
                          src="/image/icon-comment.png"
                          alt="Comments"
                        />
                        <div className="text-wrapper-32">23</div>
                      </div>
                    </div>
                    <div className="text-wrapper-31">Read More</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="btn-start">
              <div className="text-wrapper-7">Explore All Stories</div>
            </div>
          </div>
          <div className="body-3">
            <div className="text-block-4">
              <div className="text-wrapper-20">Top Performers This Week</div>
              <p className="see-who-s-leading">
                See who's leading the way in our community of smoke-free
                champions.
              </p>
            </div>
            <div className="frame-8">
              <div className="text-block-5">
                <div className="text-wrapper-33">Weekly Champions</div>
                <div className="text-wrapper-34">
                  Celebrating our community leaders
                </div>
              </div>
              <div className="rank-list">
                <div className="rank-element">
                  <div className="frame-9">
                    <div className="frame-10">
                      <div className="group">
                        <div className="overlap-group-2">
                          <img
                            className="user-avt"
                            src="/image/user-avt.png"
                            alt="Sarah Johnson"
                          />
                          <div className="rank-element-2">
                            <div className="text-wrapper-35">1</div>
                          </div>
                        </div>
                      </div>
                      <div className="frame-11">
                        <div className="text-wrapper-36">Sarah Johnson</div>
                        <div className="frame-12">
                          <div className="div-3">
                            <div className="text-wrapper-37">🔥</div>
                            <div className="text-wrapper-38">
                              365 days streak
                            </div>
                          </div>
                          <div className="div-3">
                            <div className="text-wrapper-39">⭐</div>
                            <div className="text-wrapper-40">2500 points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <img
                      className="element-2"
                      src="/image/ranking1.png"
                      alt="First place"
                    />
                  </div>
                </div>
                <div className="rank-element">
                  <div className="frame-13">
                    <div className="frame-10">
                      <div className="group">
                        <div className="overlap-group-2">
                          <img
                            className="user-avt-2"
                            src="/image/user-avt2.png"
                            alt="Mike Chen"
                          />
                          <div className="rank-element-3">
                            <div className="text-wrapper-35">2</div>
                          </div>
                        </div>
                      </div>
                      <div className="frame-11">
                        <div className="text-wrapper-36">Mike Chen</div>
                        <div className="frame-12">
                          <div className="div-3">
                            <div className="text-wrapper-37">🔥</div>
                            <div className="text-wrapper-38">
                              298 days streak
                            </div>
                          </div>
                          <div className="div-3">
                            <div className="text-wrapper-39">⭐</div>
                            <div className="text-wrapper-40">2100 points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <img
                      className="element-3"
                      src="/image/ranking2.png"
                      alt="Second place"
                    />
                  </div>
                </div>
                <div className="rank-element">
                  <div className="frame-14">
                    <div className="frame-10">
                      <div className="group">
                        <div className="overlap-group-2">
                          <img
                            className="user-avt"
                            src="/image/user-avt3.png"
                            alt="Emma Davis"
                          />
                          <div className="rank-element-4">
                            <div className="text-wrapper-35">3</div>
                          </div>
                        </div>
                      </div>
                      <div className="frame-11">
                        <div className="text-wrapper-36">Emma Davis</div>
                        <div className="frame-12">
                          <div className="div-3">
                            <div className="text-wrapper-37">🔥</div>
                            <div className="text-wrapper-38">
                              245 days streak
                            </div>
                          </div>
                          <div className="div-3">
                            <div className="text-wrapper-39">⭐</div>
                            <div className="text-wrapper-40">1850 points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <img
                      className="element-2"
                      src="/image/ranking3.png"
                      alt="Third place"
                    />
                  </div>
                </div>
              </div>
              <div className="btn-leaderboard">
                <div className="text-wrapper-5">View Full Leaderboard</div>
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="content">
              <div className="info">
                <div className="div-4">
                  <div className="logo-2">
                    <div className="text-wrapper-41">Quithub</div>
                  </div>
                  <p className="text-wrapper-42">
                    Track your progress, connect with others, and celebrate
                    every milestone on your journey to a healthier life.
                  </p>
                </div>
                <div className="div-4">
                  <div className="text-wrapper-43">Product</div>
                  <div className="text-wrapper-44">Overview</div>
                  <div className="text-wrapper-45">Pricing</div>
                  <div className="text-wrapper-46">Customer stories</div>
                </div>
                <div className="info-2">
                  <div className="text-wrapper-43">Resources</div>
                  <div className="text-wrapper-45">Blog</div>
                  <div className="text-wrapper-45">Guides & tutorials</div>
                  <div className="text-wrapper-47">Help center</div>
                </div>
                <div className="info-2">
                  <div className="text-wrapper-43">Company</div>
                  <div className="text-wrapper-45">About us</div>
                  <div className="text-wrapper-45">Careers</div>
                  <div className="text-wrapper-48">Media kit</div>
                </div>
                <div className="try-btn">
                  <div className="text-wrapper-49">Try It Today</div>
                  <p className="text-wrapper-50">
                    Track your progress for free today!
                  </p>
                  <button className="button">
                    <div className="text-wrapper-8">Learn More</div>
                  </button>
                </div>
              </div>
              <div className="btm">
                <div className="tems-and-condition">
                  <div className="language">
                    <div className="icon">
                      <div className="group-2">
                        <img
                          className="twitter"
                          src="/assets/Group.svg"
                          alt="Language icon"
                        />
                      </div>
                    </div>
                    <div className="text-wrapper-51">English</div>
                    <img
                      className="arrow"
                      src="/assets/Vector.svg"
                      alt="Dropdown arrow"
                    />
                  </div>
                  <div className="text-wrapper-51">Terms & privacy</div>
                </div>
                <div className="social-icon">
                  <img
                    className="facebook"
                    src="/assets/BlackFacebook.svg"
                    alt="Facebook"
                  />
                  <img
                    className="twitter"
                    src="/assets/BlackTwitter.svg"
                    alt="Twitter"
                  />
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Home;
