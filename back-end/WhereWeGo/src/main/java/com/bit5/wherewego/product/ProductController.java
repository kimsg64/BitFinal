package com.bit5.wherewego.product;

import javax.servlet.http.HttpSession;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.bit5.wherewego.place.PlaceDAOImp;
import com.bit5.wherewego.user.UserDAOImp;
import com.bit5.wherewego.user.UserVO;



@Controller
public class ProductController {
	SqlSession sqlSession;

	public SqlSession getSqlSession() {
		return sqlSession;
	}
	@Autowired
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}

	//포인트샵 리스트
	@RequestMapping("/pointshopList")
	public ModelAndView list(PdPagingVO pVo, @CookieValue(name = "userId") String cookie) {
		ModelAndView mav = new ModelAndView();
		System.out.println(cookie);
		
		ProductDAOImp dao = sqlSession.getMapper(ProductDAOImp.class);
		int total= dao.totalProductCount(pVo.getSearchKey(), pVo.getSearchWord());		
		pVo.setTotalRecord(total);
		
		int num1 = pVo.getOnePageRecord() * pVo.getNowPage();
		int num2;
		
		int lastPageRecord = pVo.getTotalRecord() % pVo.getOnePageRecord();
		if (pVo.getTotalPage() == pVo.getNowPage() && lastPageRecord != 0) {
			num2 = lastPageRecord;
		} else {
			num2 = pVo.getOnePageRecord();
		}
		
		ProductDAOImp dao2 = sqlSession.getMapper(ProductDAOImp.class);
		mav.addObject("list",dao2.productAllSelect(num1,num2,pVo.getSearchKey(),pVo.getSearchWord()));
		mav.addObject("pVo",pVo);	
		mav.setViewName("pointshop/pointshopList");
		
		return mav;
	}
	//포인트샵 뷰
	@RequestMapping("/pointshopView")
	public ModelAndView pointshopView(String p_num, PdPagingVO pVo,ProductVO ppVo, UserVO uVo) {
		ModelAndView mav = new ModelAndView();
		ProductDAOImp dao = sqlSession.getMapper(ProductDAOImp.class);
		mav.addObject("vo", dao.pointshopView(p_num));
		mav.addObject("pVo", pVo);
		mav.addObject("ppVo", ppVo);
		mav.addObject("uVo", uVo);
		mav.setViewName("/pointshop/pointshopView");
		
		return mav;
	}
	// 샵 게시물 삭제
	@RequestMapping("/pdDel")
	public ModelAndView pdDel(String p_num) {
		ProductDAOImp dao = sqlSession.getMapper(ProductDAOImp.class);
		int cnt = dao.pdDelete(p_num);
		
		ModelAndView mav = new ModelAndView();
		if(cnt>0) {
			mav.setViewName("redirect:pointshopList");
		}else {
			mav.addObject("p_num", p_num);
			mav.setViewName("redirect:pointshopView");
		}
		return mav;
	}
	
	//포인트샵 결제 뷰
	@RequestMapping("/paymentPage")
	public ModelAndView paymentPage(String p_num, ProductVO ppVo, UserVO uVo) {
		ModelAndView mav = new ModelAndView();
		ProductDAOImp dao = sqlSession.getMapper(ProductDAOImp.class);
		UserDAOImp dao2 = sqlSession.getMapper(UserDAOImp.class);
		mav.addObject("vo", dao.paymentPageOk(p_num));
		mav.addObject("ppVo", ppVo);
		mav.addObject("uVo", uVo);
		mav.setViewName("/pointshop/paymentPage");
		
		return mav;
	}
	//포인트샵 수정폼
	@RequestMapping("/pointshopEdit")
	public ModelAndView pointshopEdit(String p_num) {
		ModelAndView mav = new ModelAndView();
		ProductDAOImp dao = sqlSession.getMapper(ProductDAOImp.class);
		mav.addObject("vo", dao.pointshopView(p_num));
		mav.setViewName("pointshop/pointshopEdit");
		
		return mav;
		
	}
	//포인트샵 수정
	@RequestMapping(value="/pointshopEditOk", method=RequestMethod.POST)
	public ModelAndView pointshopEditOk(ProductVO vo, HttpSession session) {
		
		ModelAndView mav = new ModelAndView();
		ProductDAOImp dao = sqlSession.getMapper(ProductDAOImp.class);
		int cnt = dao.pointshopEditOk(vo);
		mav.addObject("p_num", vo.getP_num());
		
		if(cnt>0) {
			mav.setViewName("redirect:pointshopView");
		}else {
			mav.addObject("msg","수정");
			mav.setViewName("pointshop/pointshopResult");
		}
		return mav;
	}
	// 승인 미승인 ㄱㄱ
	@RequestMapping("/placegrade")
	public ModelAndView placegrade(int pcode, String grade) {
		ModelAndView mav = new ModelAndView();
		PlaceDAOImp dao = sqlSession.getMapper(PlaceDAOImp.class);
		
		int cnt = dao.placegrade(pcode, grade);
		mav.addObject("pcode", pcode);
		mav.setViewName("redirect:placeView");
		return mav;
	}
}
