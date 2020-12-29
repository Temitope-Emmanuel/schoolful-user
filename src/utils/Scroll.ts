import React from "react"


const useScroll = () => {
    const [scrolling, setScrolling] = React.useState({
        scrolling: false,
        scrollTop: 0
      })
    
      const onScroll = (e: any) => {
        setScrolling(curSt => ({
          scrollTop: e.target.documentElement.scrollTop,
          scrolling: e.target.documentElement.scrollTop > 0
        }))
      }
    
      
      React.useEffect(() => {
        window.addEventListener("scroll", onScroll)
        return function () {
          window.removeEventListener("scroll", onScroll)
        }
      }, [])
      return scrolling
}
export default useScroll