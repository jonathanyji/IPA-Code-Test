"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Inter } from 'next/font/google';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

const Navigation = ({ children }: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const { user } = useUser();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (user) {
            axios.get(`${baseUrl}/api/user/getuserbyemail/` + user?.email).then((res) => {
                if (res.data.message === 'User not found') {
                    router.push('/register')
                } else {
                    setIsVisible(true);
                }
            })
        }

    }, [user]);

    return (
        <div>
          <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      <a
                        href="/"
                        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                        aria-current="page"
                      >
                        Home
                      </a>
                      {user && isVisible && (
                        <>
                          <a
                            href="/upload"
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            Upload
                          </a>
                          <a
                            href="/files"
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            All Files
                          </a>
                          <a
                            href="/register"
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            Register User
                          </a>
                          <a
                            href="/api/auth/logout"
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            Logout
                          </a>
                        </>
                      )}
                      {!user && (
                        <a
                          href="/api/auth/login"
                          className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          Login
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </div>
      );
};

export default Navigation;
