<?php
/*
Plugin Name: Typecase Block Library
Plugin URI: https://github.com/plaidpowered/typecase
Description: A collection of blocks
Author: Paul Houser
Author URI: https://plaidpowered.com
Text Domain: typecase-blocks
Version: 1.1
*/

if (! function_exists( 'register_block_type' )) {
    return null;
}

class Typecase
{
    protected static $instance = null;

    protected function __construct() {}
    protected function __clone() {}

    public static function instance()
    {
        if (!isset(static::$instance))
            static::$instance = new static;            
        
        return static::$instance;
    }

    public $blocks = [], $package, $plugin_dir;

    public static function setup()
    {
        self::instance()->package = json_decode(file_get_contents(__DIR__ . '/package.json'));
        self::instance()->plugin_dir = __FILE__;

        $blockfolders = scandir(__DIR__ . '/blocks');

        foreach($blockfolders as $path)
        {
            if (substr($path, 0, 1) === '.')
                continue;

            if (is_dir(__DIR__ . '/blocks/' . $path) && is_file(__DIR__ . "/blocks/$path/$path.php"))
            {           
                self::instance()->blocks[$path] = [
                    'path' => __DIR__ . "/blocks/$path",
                    'constructor' => __DIR__ . "/blocks/$path/$path.php"
                ];

                include_once __DIR__ . "/blocks/$path/$path.php";
            }
        }

        add_action('admin_init', [self::instance(), 'register_styles']);
        add_action('wp_enqueue_scripts', [self::instance(), 'register_frontend_script']);
    }

    public static function register_styles()
    {
        $self = self::instance();

        if (WP_DEBUG) 
        {
            foreach($self->blocks as $blockname => $block)
            {
                
                wp_register_script(
                    "typecase-$blockname-block",
                    plugins_url("_build/$blockname/$blockname.js", __FILE__),
                    array('wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'wp-data'),
                    $self->package->version
                );
            
                wp_register_style(
                    "typecase-$blockname-editor",
                    plugins_url("_build/$blockname/editor.css", __FILE__),
                    array(),
                    $self->package->version
                );
            }
        }
        else
        {
            wp_register_script(
                'typecase-blocks',
                plugins_url('_dist/typecase-editor.min.js', __FILE__),
                array('wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'wp-data'),
                $self->package->version
            );
    
            wp_register_style(
                'typecase-editor',
                plugins_url('_dist/typecase-editor.min.css', __FILE__),
                array(),
                $self->package->version
            );
        }
    }

    public static function register_frontend_script()
    {
        $self = self::instance();

        wp_register_script(
            "swipr",
            plugins_url("_dist/swipr.min.js", __FILE__),
            array(),
            "1.0.0",
            true
        );

        wp_register_script(
            "typecase-support",
            plugins_url(WP_DEBUG ? "_dist/typecase.js" : "_dist/typecase.min.js", __FILE__),
            array("swipr"),
            $self->package->version,
            true
        );

        wp_register_style(
            "typecase-styles",
            plugins_url("_dist/typecase-default.min.css", __FILE__),
            array(),
            $self->package->version
        );
            
    }
}

Typecase::setup();