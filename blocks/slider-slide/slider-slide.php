<?php

namespace Typecase\Slider\Slide;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function register_block()
{
    register_block_type(
        'typecase/slider-slide', array(
        'editor_script' => WP_DEBUG ? 'typecase-slider-slide-block' : 'typecase-blocks',
        'editor_style' => WP_DEBUG ? 'typecase-slider-slide-editor' : 'typecase-editor',
    ));

}
add_action('init', 'Typecase\Slider\Slide\register_block');
add_filter("the_content", function ( $content )
{

    $matches = preg_match_all(
        '/<!-- wp:typecase\/slider (.*?)-->(.*?)<!-- \/wp:typecase\/slider -->/ms',
        $content,
        $sliders,
        PREG_SET_ORDER
    );
    
    foreach( $sliders as $slider ) {

        $slider_settings = trim( $slider[1] );
        if (!empty($slider_settings)) {
            $slider_settings = json_decode($slider_settings);
        } else {
            $slider_settings = [];
        }

        $matches = preg_match_all(
            '/<!-- wp:typecase\/slider-slide (.*?)-->(.*?)<!-- \/wp:typecase\/slider-slide -->/ms',
            $slider[2],
            $slides,
            PREG_SET_ORDER
        );

        foreach( $slides as $block )
        {

            $settings = trim( $block[1] );
            if (!empty($settings)) {
                $settings = json_decode($settings);
            } else {
                continue;
            }
            
            if ( ! preg_match( '/<img class="background" [^>]*>/ms', $block[2], $image ) ) {
                continue;
            }

            $resized_size = apply_filters( 
                'Typecase/Slide/background_size', 
                'typecase_slider_background', 
                $image, 
                $block, 
                $slider_settings 
            );

            $resized_src = wp_get_attachment_image( $settings->id, $resized_size, false, [ 'class' => 'background' ] );
            
            if ( ! $resized_src )
                continue;

            $resized_src = apply_filters( 'Typecase/Slide/background_img', $resized_src, $settings->id, $image, $block );

            $content = str_replace( $image[0], $resized_src, $content );
        }

    }

    return $content;

}, 7, 1);