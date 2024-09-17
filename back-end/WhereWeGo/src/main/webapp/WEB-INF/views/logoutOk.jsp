<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:if test="${logid==null}">
	<script>
		alert("로그아웃 성공");
		location.href="http://localhost:3000";
	</script>
</c:if>