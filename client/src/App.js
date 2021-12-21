import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { Link } from "react-router-dom";
import AuthService from "./services/auth.service";

import courseService from "./services/course.service";
import HomePage from "./pages/Homepage/HomePage";
import Navbar2 from "./components/Navbar2";
import MemberCenter from "./pages/MemberCenter/MemberCenter";
import Login from "./components/member/Login";
import ShoppingCart from "./pages/ShoppingCart/shopping-cart/ShoppingCart";
import ShoppingList from "./pages/ShoppingCart/ShoppingList/ShoppingList";
import PaymentMethod from "./pages/ShoppingCart/paymentMethod/PaymentMethod";
import getValidMessage from "./validMessage/validMessage";
import Swal from "sweetalert2";

// 測試元件區
// import Masonry from "./pages/Masonry/Masonry";
import Forum from "./pages/Forum/Forum";

import Contactus from "./pages/Contactus/Contactus";
import About from "./pages/About/About";
import Course from "./pages/Course/Course";
import Chef from "./pages/Chef/Chef";

import CourseDetail from "./pages/CourseDetail/CourseInfomation";
import ForumPublish from "./pages/Forum/ForumPublish";
import ForumUpdate from "./pages/Forum/ForumUpdate";
import Footer from "./components/Footer";

function App() {
  // 用Link傳資料給結帳頁面
  // 結帳網址
  const [link, setLink] = useState("/");
  // 結帳資料
  const [data, setData] = useState({});

  // 當前所有收藏課程
  const [currentCourses, setCurrentCourses] = useState([]);
  // 當前使用者所有的收藏課程id
  const [collectionIds, setCollectionIds] = useState([]);

  // 存取當前登入中的使用者資料
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  // 登入視窗開關狀態
  const [showLogin, setShowLogin] = useState(false);

  //課程搜尋列狀態
  const [isActiveCourseSearch, setActiveCourseSearch] = useState("false");

  //儲存購物車的課程資訊
  const [cartCourseInfoList, setCartCourseInfoList] = useState([]);
  // [{
  //   course_id: "",
  //   member_id: "",
  //   course_image: "",
  //   course_name: "",
  //   course_price: "",
  //   member_limit: "",
  //   batch_id: "", //(course_batch table)
  //   batch_date: "", //(course_batch table)
  //   member_count: "", //(course_batch table)
  //   amount: 1, //
  // }]
  //新增課程
  const [newAddCourse, setNewAddCourse] = useState({});
  //當前購物車課程數量
  const numberOfCoursesInCart = cartCourseInfoList?.length;
  //當前購物車總金額
  const [sumCartCoursePrice, setSumCartCoursePrice] = useState(0);

  // 開啟Login Container(登入視窗)
  const handleLoginClick = (e) => {
    e.stopPropagation();
    setShowLogin(true);
    document.querySelector("body").classList.add("stopScroll");
  };

  // 點擊任意處關閉login container(登入視窗)
  useEffect(() => {
    window.addEventListener("click", (e) => {
      setShowLogin(false);
      document.querySelector("body").classList.remove("stopScroll");
    });
  }, []);

  //課程搜尋列狀態判斷
  const handleToggleCourseSearch = async (msg) => {
    // 點擊任意處關閉
    if (msg === "close") {
      setActiveCourseSearch(true);
    } else {
      // 點擊按鈕toggle
      setActiveCourseSearch(!isActiveCourseSearch);
    }
  };

  //產生購物車中，單筆課程所需用到的資料
  let getOneCourseObject = async (batch_id) => {
    try {
      // 根據course_id與batch_id拿到購物車所需的課程資料 (cart)
      let result = await courseService.getOneCourseObject(batch_id);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  // 判斷是否登入，並加入購物車
  async function handleAddIntoCart(
    currentUser,
    member_id,
    course_id,
    batch_id
  ) {
    // 把課程加入購物車資料庫
    if (currentUser) {
      // 把課程加入購物車資料庫
      addCourseIntoCart(member_id, course_id, batch_id);
    } else {
      // 把課程加入購物車state
      setCartCourseInfoList(
        ...cartCourseInfoList,
        getOneCourseObject(batch_id)
      );
    }
  }

  // 把課程加入購物車資料庫
  async function addCourseIntoCart(member_id, course_id, batch_id) {
    //檢查購物車資料庫中是否已經有此課程
    console.log("handleAddIntoCart start");
    console.log("member_id, course_id, batch_id: ");
    console.log(member_id, course_id, batch_id);
    let IfInCartResult = await courseService.IfCourseInCart(
      member_id,
      course_id,
      batch_id
    );
    let ifIncart = IfInCartResult.data.inCart[0]?.inCart;
    console.log("ifIncart: ");
    // 回傳Incart值;
    console.log(ifIncart);

    // 在try/catch外宣告變數，用來接住回傳的資料庫狀態
    let updateResult;

    try {
      // 把該課程加入購物車資料庫
      updateResult = await courseService.UpdateCart(
        member_id,
        course_id,
        batch_id,
        1,
        1
      );
    } catch (error) {
      console.log(error);
    }
    console.log("此課程於資料庫中的狀態: ");
    console.log(updateResult.data.updateResult[0]);
    //取得所有課程資料，同時re-render購物車
    getAllCourseObject(currentUser.id);
    console.log("handleAddIntoCart done");
  }

  const getAllCourseObject = async function (member_id) {
    try {
      console.log("getAllCourseObject start");
      let result = await courseService.getAllCourseObject(member_id);
      let consoleCheck = result.data.courseInfoInCart;
      // 如果購物車沒課程則將cartCourseInfoList恢復成空陣列
      if (consoleCheck === undefined) consoleCheck = [];
      setCartCourseInfoList(consoleCheck);
      console.log("cartCourseInfoList :");
      console.log(consoleCheck);
    } catch (error) {
      console.log(error);
    }
  };

  // 加入/移除收藏
  const handleAddIntoCollection = async (course_id) => {
    if (!currentUser) {
      Swal.fire({
        icon: "error",
        title: "請先登入後再進行操作哦！",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // 判斷此課程是否在收藏內
    let type = collectionIds.includes(course_id);

    try {
      let result = await courseService.course_collection_edit(
        currentUser.id,
        course_id,
        type
      );
      if (type) {
        // 跳通知
        Swal.fire({
          icon: "success",
          title: "課程收藏刪除成功！",
          showConfirmButton: false,
          timer: 1500,
        });
      } else
        Swal.fire({
          icon: "success",
          title: "課程收藏成功！",
          showConfirmButton: false,
          timer: 1500,
        });

      // 拿到更新後的課程收藏
      if (currentUser) {
        refreshCollection();
      }
    } catch (error) {
      console.log(error.response);
      // let { code } = error.response.data;
      // setErrorMsg(getValidMessage("course", code));
    }
  };

  // 重整當前收藏課程
  let refreshCollection = async () => {
    try {
      let result = await courseService.course_collection(currentUser.id);

      // 如果這次沒回傳任何course
      if (!result.data.course) {
        setCurrentCourses([]);
        setCollectionIds([]);
        return;
      }

      // 設定當前課程的資料Array
      setCurrentCourses(result.data.course);

      // 設定當前使用者的所有收藏課程Array
      setCollectionIds(result.data.course.map((item) => item.id));
    } catch (error) {
      console.log(error.response);
      let { code } = error.response.data;

      // 跳通知
      Swal.fire({
        icon: "error",
        title: getValidMessage("course", code),
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // useEffect(() => {
  // }, [cartCourseInfoList]);

  useEffect(() => {
    if (currentUser) {
      try {
        getAllCourseObject(currentUser.id);
        console.log("member_id: ");
        console.log(currentUser.id);
      } catch (error) {
        console.log(error);
      }
    }
  }, [currentUser]);

  return (
    <Router>
      <Navbar2
        handleLoginClick={handleLoginClick}
        currentUser={currentUser}
        isActiveCourseSearch={isActiveCourseSearch}
        handleToggleCourseSearch={handleToggleCourseSearch}
        cartCourseInfoList={cartCourseInfoList}
        setCartCourseInfoList={setCartCourseInfoList}
        newAddCourse={newAddCourse}
        numberOfCoursesInCart={numberOfCoursesInCart}
        sumCartCoursePrice={sumCartCoursePrice}
        setSumCartCoursePrice={setSumCartCoursePrice}
        handleAddIntoCollection={handleAddIntoCollection}
        link={link}
        setLink={setLink}
        data={data}
        setData={setData}
      />
      {showLogin && (
        <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} />
      )}

      <Switch>
        <Route path="/" exact>
          <div className="footerPadding">
            <HomePage />
          </div>
          <Footer />
        </Route>

        <Route path="/ShoppingCart" exact>
          <ShoppingCart currentUser={currentUser} />
          <Footer />
        </Route>

        <Route path="/memberCenter" exact>
          <MemberCenter
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            handleAddIntoCart={handleAddIntoCart}
          />
        </Route>

        <Route path="/Forum" exact>
          <div className="footerPadding">
            <Forum currentUser={currentUser} />
          </div>
          <Footer />
        </Route>

        <Route path="/courses/category" exact>
          <div className="footerPadding">
            <Course
              currentUser={currentUser}
              link={link}
              setLink={setLink}
              data={data}
              setData={setData}
              collectionIds={collectionIds}
              refreshCollection={refreshCollection}
              handleAddIntoCollection={handleAddIntoCollection}
              handleAddIntoCart={handleAddIntoCart}
            />
          </div>
          <Footer />
        </Route>
        {/* 課程探索 */}
        <Route path="/courses" exact>
          <div className="footerPadding">
            <Course
              currentUser={currentUser}
              handleAddIntoCart={handleAddIntoCart}
            />
          </div>
          <Footer />
        </Route>
        <Route path="/ForumPublish" exact>
          <div className="footerPadding">
            <ForumPublish currentUser={currentUser} />{" "}
          </div>{" "}
          <Footer />
        </Route>

        <Route path="/ForumUpdate" exact>
          <div className="footerPadding">
            <ForumUpdate currentUser={currentUser} />{" "}
          </div>
          <Footer />{" "}
        </Route>

        <Route path="/courses/:course_id" exact>
          <div className="footerPadding">
            <CourseDetail
              currentUser={currentUser}
              handleLoginClick={handleLoginClick}
              handleAddIntoCart={handleAddIntoCart}
              link={link}
              setLink={setLink}
              data={data}
              setData={setData}
            />
          </div>
          <Footer />
        </Route>

        <Route path="/ShoppingList" exact>
          <div className="footerPadding">
            <ShoppingList currentUser={currentUser} />
          </div>
          <Footer />
        </Route>

        <Route path="/PaymentMethod" exact>
          <div className="footerPadding">
            <PaymentMethod currentUser={currentUser} />
          </div>
          <Footer />
        </Route>

        <Route path="/chef" exact>
          <div className="footerPadding">
            <Chef currentUser={currentUser} />
          </div>
          <Footer />
        </Route>

        <Route path="/about" exact>
          <div className="footerPadding">
            <About />
          </div>
          <Footer />
        </Route>

        <Route path="/contactus" exact>
          <div className="contactus">
            <Contactus />
          </div>
          <Footer />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
