import React from "react";
import { useState } from "react";
import Chef from "../images/avatar.jpg";

function ChefCard2(props) {
  const ChefInfomation = [
    {
      chefIntroduce1:
        "做菜總是讓人很開心，做菜總是讓人很開心，做菜總是讓人很開心，因為料理永遠會給以最直接的方式回饋給你。",
      chefIntroduce2: "Kin",
      chefInfoTiele: "LONGTAL restaurant & bar<br />主廚與經營者 林明健(Kin)",
      chefInfo: [
        "超過20年專業廚師經歷",
        "創立四間餐飲品牌",
        "創立品牌連續四年獲得米其林一星肯定",
        "創立品牌連續四年獲得米其餐盤推薦",
      ],
    },

    {
      chefIntroduce1:
        "做菜總是讓人很開心，因為料理永遠會給以最直接的方式回饋給你。",
      chefIntroduce2: "我是Kin,<br />我想與你一起開心地做料理。",
      chefInfoTiele: "LONGTAL restaurant & bar<br />主廚與經營者 林明健(Kin)",
      chefInfo: [
        "超過20年專業廚師經歷",
        "創立四間餐飲品牌",
        "創立品牌獲得米其林一星肯定",
        "創立品牌獲得米其餐盤推薦",
      ],
    },
  ];

  return (
    <>
      <div className="st-chefCard2">
        <img className="st-chefCard2Picture" src={Chef} alt=""></img>
        <div className="st-chefCard2Top">
          「{ChefInfomation[0].chefIntroduce1}」
          <div className="st-chefCard2Line"></div>
          <div className="st-chefCard2TopChefName">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  "我是" +
                  ChefInfomation[0].chefIntroduce2 +
                  ",<br /> " +
                  "我想與您一起開心地做料理！",
              }}
            ></div>
          </div>
        </div>
        <div className="st-chefCard2Down">
          <div
            dangerouslySetInnerHTML={{
              __html: ChefInfomation[0].chefInfoTiele,
            }}
          ></div>
          <ul>
            <li>{ChefInfomation[0].chefInfo[0]}</li>
            <li>{ChefInfomation[0].chefInfo[1]}</li>
            <li>{ChefInfomation[0].chefInfo[2]}</li>
            <li>{ChefInfomation[0].chefInfo[3]}</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default ChefCard2;
