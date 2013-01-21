/*!
 * Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */
/**
 * Module which contains the base class for Blocks, and a Default/Debug block.
 *
 * @name block.block
 * @namespace block/block
 */
define(["aloha","aloha/jquery","block/blockmanager","aloha/observable","aloha/floatingmenu"],function(e,t,n,r,i){var s=window.GENTICS,o=Class.extend(r,{title:null,id:null,$element:null,_currentlyRendering:!1,_initialized:!1,_isInsideNestedEditable:!1,_constructor:function(e){var n=this;this.$element=e,e.attr("id")?this.id=e.attr("id"):(this.id=s.Utils.guid(),e.attr("id",this.id)),e.contentEditable(!1),e.addClass("aloha-block"),this.isDraggable()&&(e.find("img").attr("draggable","false"),e.find("a").attr("draggable","false")),this._onElementClickHandler=function(e){t(e.target).closest(".aloha-block").get(0)===n.$element.get(0)&&(n._fixScrollPositionBugsInIE(),n.activate(e.target,e))},this._connectThisBlockToDomElement(e),this._initialized=!0},_onElementClickHandler:null,_preventSelectionChangedEventHandler:function(){e.Selection.preventSelectionChanged()},_connectThisBlockToDomElement:function(e){var n=this,r=t(e);this.$element&&(this.$element.unbind("click",this._onElementClickHandler),this.$element.unbind("mousedown",this._preventSelectionChangedEventHandler),this.$element.unbind("focus",this._preventSelectionChangedEventHandler),this.$element.unbind("dblclick",this._preventSelectionChangedEventHandler)),this.$element=r,this.$element.bind("click",this._onElementClickHandler),this.$element.bind("mousedown",this._preventSelectionChangedEventHandler),this.$element.bind("focus",this._preventSelectionChangedEventHandler),this.$element.bind("dblclick",this._preventSelectionChangedEventHandler),this.init(this.$element,function(){window.setTimeout(function(){n._postProcessElementIfNeeded()},5)})},_fixScrollPositionBugsInIE:function(){var e=t(window).scrollTop();window.setTimeout(function(){t(window).scrollTop()!==e&&t(window).scrollTop(e)},10)},init:function(e,t){t()},shouldDestroy:function(){var e=this.$element.parent().closest(".aloha-block,.aloha-editable,.aloha-block-collection");return e.hasClass("aloha-block-collection")&&this.$element[0].tagName.toLowerCase()==="div"?!0:e.hasClass("aloha-editable")},destroy:function(e){if(!this.shouldDestroy()&&e!==!0)return;var t=this,r=new s.Utils.RangeObject;r.startContainer=r.endContainer=this.$element.parent()[0],r.startOffset=r.endOffset=s.Utils.Dom.getIndexInParent(this.$element[0]),n.trigger("block-delete",this),n._unregisterBlock(this),this.unbindAll();var i=this.$element[0].tagName.toLowerCase()==="span";this.$element.fadeOut("fast",function(){t.$element.remove(),n.trigger("block-selection-change",[]),window.setTimeout(function(){i&&r.select()},5)})},getId:function(){return this.id},getSchema:function(){return null},getTitle:function(){return this.title},isDraggable:function(){return this.$element[0].tagName.toLowerCase()==="div"&&this.$element.parents(".aloha-editable,.aloha-block,.aloha-block-collection").first().hasClass("aloha-block-collection")?!0:this.$element.parents(".aloha-editable,.aloha-block").first().hasClass("aloha-editable")},activate:function(r,s){var o=[];t.each(n._getHighlightedBlocks(),function(){this.deactivate()}),this.$element.attr("data-block-skip-scope")!=="true"&&i.setScope("Aloha.Block."+this.attr("aloha-block-type")),this.$element.addClass("aloha-block-active"),this._highlight(),o.push(this),this.$element.parents(".aloha-block").each(function(){var e=n.getBlock(this);e._highlight(),o.push(e)}),t(r).closest(".aloha-editable,.aloha-block,.aloha-table-cell-editable").first().hasClass("aloha-block")?(this._isInsideNestedEditable=!1,e.getSelection().removeAllRanges()):(this._isInsideNestedEditable=!0,s&&e.Selection.updateSelection(s)),n.trigger("block-selection-change",o)},deactivate:function(){var e=this;this._unhighlight(),this.$element.parents(".aloha-block").each(function(){e._unhighlight()}),this.$element.removeClass("aloha-block-active"),n.trigger("block-selection-change",[])},isActive:function(){return this.$element.hasClass("aloha-block-active")},_highlight:function(){this.$element.addClass("aloha-block-highlighted"),n._setHighlighted(this)},_unhighlight:function(){this.$element.removeClass("aloha-block-highlighted"),n._setUnhighlighted(this)},_update:function(){var e=this;if(this._currentlyRendering)return;if(!this._initialized)return;this._currentlyRendering=!0,this.update(this.$element,function(){e._postProcessElementIfNeeded()}),this._currentlyRendering=!1},update:function(e,t){t()},_postProcessElementIfNeeded:function(){this.createEditablesIfNeeded(),this._checkThatNestedBlocksAreStillConsistent(),this._makeNestedBlockCollectionsSortable(),this.renderBlockHandlesIfNeeded(),this.isDraggable()&&this.$element[0].tagName.toLowerCase()==="span"?(this._setupDragDropForInlineElements(),this._disableUglyInternetExplorerDragHandles()):this.isDraggable()&&this.$element[0].tagName.toLowerCase()==="div"&&(this._setupDragDropForBlockElements(),this._disableUglyInternetExplorerDragHandles())},_checkThatNestedBlocksAreStillConsistent:function(){this.$element.find(".aloha-block").each(function(){var e=n.getBlock(this);e&&e.$element[0]!==this&&e._connectThisBlockToDomElement(this)})},_makeNestedBlockCollectionsSortable:function(){var e=this;this.$element.find(".aloha-block-collection").each(function(){var r=t(this);r.closest(".aloha-block").get(0)===e.$element.get(0)&&n.createBlockLevelSortableForEditableOrBlockCollection(r)})},_disableUglyInternetExplorerDragHandles:function(){this.$element.get(0).onresizestart=function(e){return!1},this.$element.get(0).oncontrolselect=function(e){return!1},this.$element.get(0).onmovestart=function(e){return!1},this.$element.get(0).onselectstart=function(e){return!1}},_setupDragDropForInlineElements:function(){var e=this,n=null,r=null,i=function(){if(n){var i=t(n);i.is(".aloha-block-dropInlineElementIntoEmptyBlock")?(i.children().remove(),i.append(r)):i.is(".aloha-block-droppable-right")?(i.html(i.html()+" "),i.after(r)):(i.prev("[data-i]").length>0&&i.prev("[data-i]").html(i.prev("[data-i]").html()+" "),i.html(" "+i.html()),i.before(r)),r.removeClass("ui-draggable").css({left:0,top:0}),e._fixScrollPositionBugsInIE()}t(".aloha-block-dropInlineElementIntoEmptyBlock").removeClass("aloha-block-dropInlineElementIntoEmptyBlock")},s=[];this.$element.draggable({handle:".aloha-block-draghandle",scope:"aloha-block-inlinedragdrop",revert:function(){return n===null},revertDuration:250,stop:function(){Ext.isIE7&&i(),t.each(s,function(){e._dd_traverseDomTreeAndRemoveSpans(this)}),r=null,s=[]},start:function(){s=[],t(".aloha-editable").children("p:empty").html("&nbsp;");var o={tolerance:"pointer",addClasses:!1,scope:"aloha-block-inlinedragdrop",over:function(i,o){s.indexOf(this)===-1&&s.push(this),r=o.draggable;if(t(this).is(":empty")||t(this).children("br.aloha-end-br").length>0||t(this).html()==="&nbsp;"){t(this).addClass("aloha-block-dropInlineElementIntoEmptyBlock"),n=this;return}e._dd_traverseDomTreeAndWrapCharactersWithSpans(this),t("span[data-i]",this).droppable({tolerance:"pointer",addClasses:!1,scope:"aloha-block-inlinedragdrop",over:function(){n&&t(n).removeClass("aloha-block-droppable"),n=this,t(this).addClass("aloha-block-droppable")},out:function(){t(this).removeClass("aloha-block-droppable"),n===this&&(n=null)}}),t.ui.ddmanager.prepareOffsets(o.draggable.data("draggable"),i)},out:function(){t(this).removeClass("aloha-block-dropInlineElementIntoEmptyBlock")},drop:function(){Ext.isIE7||i()}};t(".aloha-editable").children(":not(.aloha-block)").droppable(o),t(".aloha-table-cell-editable").droppable(o)}})},_dd_traverseDomTreeAndWrapCharactersWithSpans:function(e){var t;for(var n=0,r=e.childNodes.length;n<r;n++){t=e.childNodes[n];if(t.nodeType===1){if(!~t.className.indexOf("aloha-block")&&t.attributes["data-i"]===undefined)this._dd_traverseDomTreeAndWrapCharactersWithSpans(t);else if(t.attributes["data-i"])return}else if(t.nodeType===3){var i=this._dd_insertSpans(t);n+=i,r+=i}}},_dd_splitText:function(e){var t=e.split(/(?=\b)/),n=[],r=!1;for(var i=0,s=t.length;i<s;i++)/[^\t\n\r ]/.test(t[i])?r?(n.push(" "+t[i]),r=!1):n.push(t[i]):r=!0;return r&&(n[n.length-1]+=" "),n},_dd_insertSpans:function(e){var t=e.nodeValue;if(!/[^\t\n\r ]/.test(t))return 0;var n=document.createDocumentFragment(),r=this._dd_splitText(t),i=r.length,s,o,u,a,f=0;for(var l=0;l<i;l++){o=r[l];if(o.length===0)continue;u=Math.floor(o.length/2);if(Ext.isIE7||Ext.isIE8)u=0;u>0&&(s=document.createElement("span"),s.appendChild(document.createTextNode(o.substr(0,u))),s.setAttribute("data-i",l),n.appendChild(s),f++),s=document.createElement("span"),a=o.substr(u),s.appendChild(document.createTextNode(a)),s.setAttribute("data-i",l),s.setAttribute("class","aloha-block-droppable-right"),n.appendChild(s),f++}return e.parentNode.replaceChild(n,e),f-1},_dd_traverseDomTreeAndRemoveSpans:function(e){var t=[],n;n=function(e){var r=!1,i,s,o;for(var u=0,a=e.childNodes.length;u<a;u++)o=e.childNodes[u],o.nodeType===1&&(o.attributes["data-i"]!==undefined?(r||(r=!0,i="",s=undefined),r&&(i+=o.firstChild.nodeValue,s&&t.push(s),s=o)):(r&&(r=!1,s.parentNode.replaceChild(document.createTextNode(i),s)),~o.className.indexOf("aloha-block")||n(o)));r&&s.parentNode.replaceChild(document.createTextNode(i),s)},n(e);for(var r=0,i=t.length;r<i;r++)t[r].parentNode.removeChild(t[r])},_setupDragDropForBlockElements:function(){this.$element.find(".aloha-block-draghandle").addClass("aloha-block-draghandle-blocklevel")},createEditablesIfNeeded:function(){this.$element.find(".aloha-editable").aloha()},renderBlockHandlesIfNeeded:function(){this.isDraggable()&&this.$element.children(".aloha-block-draghandle").length===0&&this.$element.prepend('<span class="aloha-block-handle aloha-block-draghandle"></span>')},attr:function(n,r,i){var s=this,o=!1;if(arguments.length>=2){if(n.substr(0,12)==="aloha-block-"){e.Log.error("block/block","It is not allowed to set internal block attributes (starting with aloha-block-) through Block.attr() (You tried to set "+n+")");return}this._getAttribute(n)!==r&&(o=!0),this._setAttribute(n,r)}else{if(typeof n!="object")return typeof n=="string"?this._getAttribute(n):this._getAttributes();t.each(n,function(t,n){if(t.substr(0,12)==="aloha-block-"){e.Log.error("block/block","It is not allowed to set internal block attributes (starting with aloha-block-) through Block.attr() (You tried to set "+t+")");return}s._getAttribute(t)!==n&&(o=!0),s._setAttribute(t,n)})}return o&&!i&&(this._update(),this.trigger("change")),null},_setAttribute:function(e,t){this.$element.attr("data-"+e.toLowerCase(),t)},_getAttribute:function(e){return this.$element.attr("data-"+e.toLowerCase())},_getAttributes:function(){var e={};return t.each(this.$element[0].attributes,function(t,n){n.name.substr(0,5)==="data-"&&(e[n.name.substr(5).toLowerCase()]=n.value)}),e}}),u=o.extend({update:function(e,t){t()}}),a=o.extend({title:"Debugging",init:function(e,t){this.update(e,t)},update:function(e,n){e.css({display:"block"});var r='<table class="debug-block">';t.each(this.attr(),function(e,t){r+="<tr><th>"+e+"</th><td>"+t+"</td></tr>"}),r+="</table>",e.html(r),n()}});return{AbstractBlock:o,DefaultBlock:u,DebugBlock:a}});