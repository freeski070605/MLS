'use client';

import React,{useEffect,useRef,useState} from 'react';

/**
 * The thumbnail is a real frame from THIS video, never an unrelated photo.
 * Seek only when the player nears the viewport so gallery pages avoid fetching
 * every large MP4 at once. Playback rewinds to 0 on the visitor's first play.
 * This intentionally requires no ffmpeg in the Vercel build.
 */
export default function VideoWithOwnPreview({
  src,title,width,height,previewAt=0.2
}:{
  src:string;title:string;width?:number;height?:number;previewAt?:number
}){
  const videoRef=useRef<HTMLVideoElement>(null);
  const rootRef=useRef<HTMLDivElement>(null);
  const seededRef=useRef(false);
  const startedRef=useRef(false);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const el=rootRef.current;
    if(!el)return;
    if(typeof IntersectionObserver==='undefined'){setVisible(true);return}
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect()}
    },{rootMargin:'350px'});
    observer.observe(el);
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{seededRef.current=false;startedRef.current=false},[src]);
  const thumbnailFrame=()=>{
    const video=videoRef.current;
    if(!video||seededRef.current||startedRef.current||!Number.isFinite(video.duration)||video.duration<=0)return;
    seededRef.current=true;
    const offset=Math.min(Math.max(video.duration*previewAt,0.4),Math.max(0,video.duration-0.25));
    try{video.currentTime=offset}catch{/* Some browsers disallow preview seeking. */}
  };
  const startPlayback=()=>{
    const video=videoRef.current;
    if(video&&!startedRef.current){
      startedRef.current=true;
      // The frame was only for the thumbnail; actual playback begins at 0.
      if(seededRef.current)video.currentTime=0;
    }
  };
  return <div ref={rootRef} className="video-own-preview">
    <video ref={videoRef} controls playsInline preload={visible?'metadata':'none'}
      aria-label={title} width={width} height={height}
      onLoadedMetadata={thumbnailFrame} onPlay={startPlayback}>
      <source src={src} type="video/mp4"/>
      Your browser does not support this video.
    </video>
  </div>;
}
