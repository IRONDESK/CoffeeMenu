// Step1 요구사항 구현을 위한 전략

// TODO 메뉴 추가
// - [x] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다
// - [x] 메뉴의 이름을 입력 받고 확인 버튼을 누르면 메뉴 추가
// - [x] 추가되는 메뉴의 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되면, input은 빈 값으로 초기화
// - [x] input이 빈 값이라면 추가되지 않음

// TODO 메뉴 수정
// - [x] 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 이름 수정 모달창(prompt)이 뜬다
// - [x] 모달창에서 신규메뉴명 입력을 받고, 확인 버튼을 누르면 메뉴가 수정된다
// TODO 메뉴 삭제
// - [x] 메뉴의 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 confirm 모달창이 뜬다.
// - [x] 확인 버튼을 클릭하면 메뉴가 삭제된다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.

///////////////////////////////////////////////////

// Step 2 localStorage Read & Write
// - [x] localStorage에 있는 데이터를 저장한다.
//    - [x] 메뉴를 추가할 때
//    - [x] 메뉴를 삭제할 때
//    - [x] 메뉴를 수정할 때
// - [x] localStorage에 있는 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [x] 에스프레소 메뉴판 관리
// - [x] 프라푸치노 메뉴판 관리
// - [x] 블렌디드 메뉴판 관리
// - [x] 티바나 메뉴판 관리
// - [x] 디저트 메뉴판 관리

// - [x] 페이지에 최초로 로딩될 때, localStorage에 에스프레소 메뉴를 읽어온다.
// - [x] 에스프레소 메뉴를 페이지에 그려준다.

// 품절 상태 관리
// - [x] 품절 버튼을 추가한다
// - [x] 품절 버튼을 클릭하면, localStorage에 상태값이 저장된다.
// - [x] 클릭 이벤트에서 가장 가까운 li 태그의 class속성 값에 soldout을 추가한다.

// - [x] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 soldout 클래스를 추가하여 상태를 변경한다.


const $ = (selector) => document.querySelector(selector)
// document.querySelector를 반복하면서, 코드가 길어지는 현상을 막기 위해
// $를 변수로 선언하여 활용

// js 외부로 분리하기
// 분리한 js 가져오기
import store from "./store/store.js"

function App() {
  // 상태는 데이터로 이 앱에서 계속 변하는 것이 들어가야 함. 여기서는 메뉴명.
  // 사용자의 인터랙션을 잘 반영한 앱을 만들기 위해 동적페이지를 만들려면, 상태값이 중요함!

  // 에스프레소 단일 메뉴일 때, this.menu = [];
  // 여러 메뉴를 관리하기 위해, this.menu를 object로 관리
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: []
  };
  this.currentCategory = "espresso";
  
  // store 저장값 불러오기
  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    menuRender();
  }

  // 불러온 값으로 리스트에 그려주기
  const menuRender = () => {
    const templateMenuList = this.menu[this.currentCategory].map ((item, index) => {
      // data-menu-id라는 각 아이템 항목을 식별할 수 있는 고유의 아이디를 부여
      return `
      <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
    <span class="${item.soldout ? "soldout" : ""} w-100 pl-2 menu-name">${item.name}</span>
    <button type="button" class="bg-gray-50 text-gray-500 text-xsm mr-1 menu-soldout-button">
      품절
    </button>
    <button type="button" class="bg-gray-50 text-gray-500 text-xsm mr-1 menu-edit-button">
      수정
    </button>
    <button type="button" class="bg-gray-50 text-gray-500 text-xsm menu-remove-button">
      삭제
      </button>
    </li>`
    }).join("");

    // .innerHTML,Text = ?? 로 쓰면 안의 내용을 바꾸는 것이기 때문에
    // ul 태그 안에 계속 추가하려면,
    // insertAdjacentHTML("", ??); 형태로 써야 한다.
    // 태그의 앞부터 쓰려면 beforebegin
    // 태그의 안에서 위로 추가하려면 afterbegin
    // 태그의 안에서 아래로 추가하면 beforeend
    // 태그의 뒤부터 쓰려면 afterend
    // $("#espresso-menu-list").insertAdjacentHTML(
    //   "beforeend", menuItemTemplate(espressoMenuName)
    //   );
    
    $("#menu-list").innerHTML = templateMenuList;
      updateMenuCount();
  }

  // 메뉴 갯수 세기
  const updateMenuCount = () => {
    // querySelectorAll은 NodeList(array)로 들어오기 때문에,
    // length를 써서, 길이(갯수)를 이용해 메뉴의 갯수(li 갯수)를 센다.
    // const menuCounter = $("#menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${this.menu[this.currentCategory].length}개`;
  };

  // 메뉴 수정 하기 
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    // 선택한 수정 버튼에서. closest(가장 가까운 li)의 쿼리 셀렉터
    // 를 $menuName이란 변수에 담아서 코드가 길어지는 현상 방지
    // $menuName으로 받은 태그의 innerText를 수정모달창(prompt)의 기본값에 넣음
    const updatedMenuName = prompt("수정할 메뉴명을 입력해주세요.", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu); // 스토리지 업데이트
    menuRender();
  };

  // 메뉴 삭제 하기
  const RemoveMenuName = (e) => {
    if ( confirm("삭제하시겠습니까?") ) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1); // splice() : menuId번째 index를 1개 제거
      store.setLocalStorage(this.menu); // 스토리지 업데이트
      menuRender();
      updateMenuCount();
    }
  };

  // 메뉴 품절 처리 하기
  const soldoutMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldout = !this.menu[this.currentCategory][menuId].soldout;
    store.setLocalStorage(this.menu); // 스토리지 업데이트
    menuRender();
  }


  // 메뉴 수정 및 삭제
  // 메뉴가 추가되기 전엔, 마크업에 수정, 삭제 버튼이 없기 때문에
  // '이벤트 위임'을 이용해서 상위 태그에 기능을 부여해둔다.
  $("#menu-list").addEventListener("click", (e) => {
    // ul 태그에서 클릭 이벤트 위임하고,
    // 그 안의 class들을 classList로 불러온다.
    // 그리고 contains로 '수정' 버튼에 해당되는 것만 선별한다.

    // if문에 해당되면 다음 if문을 볼 필요가 없을 땐
    // if문 안에 return을 넣어주면 해당 if문에서 끝난다
    // 리소스 최소화를 위해 return을 넣을 것을 권장
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
      return;
    }

    if (e.target.classList.contains("menu-remove-button")) {
      RemoveMenuName(e);
      return;
    }

    if (e.target.classList.contains("menu-soldout-button")) {
      soldoutMenuName(e);
      return;
    }
  });


  // form 태그는 자동으로 전송해주는 속성이 있음
  // form 태그가 자동으로 전송되는 것을 막아줘야 함
  $("#menu-form")
  .addEventListener("submit", (e) => {
    // submit 이벤트가 발생해도, preventDefault(초기화방지) 해줌.
    e.preventDefault();
  });

  // 버튼을 누르거나, 엔터를 누르거나 반복되는 코드이므로
  // 하나의 변수로 받아서 각각에 넣어줌 
  const addMenuName = () => {
    if ($("#menu-name").value === ""){
      alert('값을 입력해주세요.');
      return;
    }
      // .value를 붙여서 input의 값을 가져옴
    const MenuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({ name : MenuName });
    store.setLocalStorage(this.menu); // store에 저장
    menuRender();
    // 추가 완료 했으면 input은 빈값
    $("#menu-name").value = ""
  }


  $("#menu-submit-button")
  .addEventListener("click", addMenuName);


  // 메뉴 이름 input에서 받아오기
  $("#menu-name")
  .addEventListener("keypress", (e) => {
    if (e.key !== 'Enter') {
      return;
    }
    addMenuName();
  });


  /// 카테고리별 이동

$('nav').addEventListener("click", (e) => {
    const isCategoryBtn = e.target.classList.contains("cafe-category-name");
    if (isCategoryBtn) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#categoryTitle").innerText = `${e.target.innerText} 메뉴 관리`;
      console.log(categoryName);
      menuRender();
    }
  })
}
const app = new App();
app.init();